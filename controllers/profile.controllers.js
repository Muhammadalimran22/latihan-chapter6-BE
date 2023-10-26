const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const path = require("path");

module.exports = {
  createProfile: async (req, res, next) => {
    try {
      let { first_name, last_name, birth_date } = req.body;
      let profile_picture_url = "";

      if (req.file) {
        let fileData = req.file.buffer.toString("base64");
        const result = await imagekit.upload({
          fileData,
          fileName: Date.now() + path.extname(req.file.originalname),
        });
        profile_picture_url = result.url;
      }

      const userProfile = await prisma.userProfile.create({
        data: {
          first_name,
          last_name,
          birth_date,
          profile_picture_url,
        },
      });

      return res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: userProfile,
      });
    } catch (err) {
      next(err);
    }
  },

  authenticate: async (req, res, next) => {
    try {
      const userId = req.user;
      const userProfile = await prisma.userProfile.findFirst({
        where: { userId },
      });

      if (!userProfile) {
        return res.status(404).json({
          status: false,
          message: "not Found",
          err: "user not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: {
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: req.user.email,
          birth_date: userProfile.birth_date,
          profile_picture: profile_picture_url,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
