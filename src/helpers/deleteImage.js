const fs = require("fs").promises;
const deleteImage = async (imagePatch) => {
    try {
        await fs.access(imagePatch);
        await fs.unlink(imagePatch);
        console.log("Image was deleted");
    } catch (error) {
        console.error(error.message || "Image dos't exists");
    }
}

module.exports = { deleteImage }