import multiparty from "multiparty";
// const apikey = process.env.FILESTACK_APIKEY;
const cloudinary = require("cloudinary").v2;

export default async function handle(req, res) {
  // upload to cloudinary
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  // console.log("length : ", files);
  const path = files?.file.map((f) => f.path);
  const allImages = [];
  for (const file of files.file) {
    // upload image to cloudinary
    const public_access_id = Date.now();
    await cloudinary.uploader
      .upload(file.path.toString(), { public_id: public_access_id })
      .then((res) => {
        allImages.push(res.secure_url);
      })
      .catch((err) => console.log(err));
  }

  //response
  return res.status(200).json({ allImages });
}

export const config = {
  api: { bodyParser: false },
};
