const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  fileBuffer,
  options = {}
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder:
              options.folder ||
              "david-chukwu-charity-foundation",
            public_id:
              options.publicId,
            overwrite: true,
            transformation: [
              {
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        );

      uploadStream.end(fileBuffer);
    }
  );
};

module.exports = uploadToCloudinary;