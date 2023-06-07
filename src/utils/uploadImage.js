const cloudinary = require("../../cloundinary");
const fs = require("fs");

const uploader = async (path) => await cloudinary.uploads(path, "node-mystore");

const uploadFiles = async (req, res) => {
    const urls = [];
    if (req.method === "POST") {
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        // Do something with the `urls` array
        // res.status(200).json({ urls });
        return urls;

    } else {
        res.status(405).json({
            err: "error"
        });
    }
};

module.exports = uploadFiles;