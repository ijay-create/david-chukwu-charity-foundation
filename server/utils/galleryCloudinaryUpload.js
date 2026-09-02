const cloudinary = require("../config/cloudinary");

const uploadGalleryToCloudinary = (
  fileBuffer,
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,

          folder:
            "david-chukwu-charity-foundation/gallery",

          overwrite: false,

          ...(resourceType === "image"
            ? {
                transformation: [
                  {
                    quality: "auto",
                    fetch_format: "auto",
                  },
                ],
              }
            : {}),
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadGalleryToCloudinary;