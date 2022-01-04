require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

app.set("view engine", "ejs");
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/add", async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  if (!req.files) {
    return res.status(400).send({
      message: " No files were added",
    });
  }
  // for single image
  //   let image = req.files.image;
  //   result = await cloudinary.uploader.upload(image.tempFilePath, {
  //     folder: "users",
  //   });
  //   console.log(result);
  //   const details = {
  //     name: req.body.name,
  //     result,
  //   };
  //   res.send(details);

  // for multiple images
  let imagesArray = [];
  for (let i = 0; i < req.files.image.length; i++) {
      let image = req.files.image[i];
    let result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "users",
    });
    imagesArray.push({
      asset_id: result.asset_id,
      secure_url: result.secure_url,
    });
  }
  const details = {
    name: req.body.name,
    imagesArray,
  };
  console.log(imagesArray);
  console.log(details);
  res.send(details);
});

app.listen(6000, () => console.log("Server is running at port 6000"));
