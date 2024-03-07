import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadMediaToCloudinary = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.path);
  res.json({
    url: result.secure_url,
    public_id: result.public_id,
  });
};

export const destroyMediaFromCloudinary = async (req, res) => {
  const { publicId } = req.body;
  await cloudinary.uploader.destroy(publicId);
  res.json({ ok: true });
};
