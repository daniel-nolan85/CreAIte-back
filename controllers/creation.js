import { v2 as cloudinary } from 'cloudinary';
import OpenAIApi from 'openai';
import Creation from '../models/creation.js';
import User from '../models/user.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const openai = new OpenAIApi({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const createPrompt = async (req, res) => {
  const { gptVersion } = req.body;
  try {
    const message = `Generate a quirky and imaginative prompt that can then be used for creating an image.`;
    const aiResponse = await openai.chat.completions.create({
      model:
        gptVersion === 'GPT-4 Turbo' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const prompt = aiResponse.choices[0].message.content;
    res.status(200).json({ prompt });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createImage = async (req, res) => {
  const { _id, prompt, imageSize, dalleVersion, imagesRemaining } = req.body;
  try {
    if (imagesRemaining > 0) {
      const aiResponse = await openai.images.generate({
        model: dalleVersion === 'Dall-E-2' ? 'dall-e-2' : 'dall-e-3',
        prompt,
        n: 1,
        size: imageSize,
        response_format: 'b64_json',
      });
      const image = aiResponse.data[0].b64_json;
      const user = await User.findById(_id);
      user.subscription.imagesRemaining -= 1;
      await user.save();
      res.json({ photo: image, user });
    } else {
      res.json({ message: 'No remaining images for generation' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createCaption = async (req, res) => {
  const { prompt, gptVersion } = req.body;
  try {
    const message = `Create a caption for an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model:
        gptVersion === 'GPT-4 Turbo' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const caption = aiResponse.choices[0].message.content;
    res.status(200).json({ caption });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createKeywords = async (req, res) => {
  const { prompt, gptVersion } = req.body;
  try {
    const message = `Provide some comma separated keywords that will relate to an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model:
        gptVersion === 'GPT-4 Turbo' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const keywords = aiResponse.choices[0].message.content;
    res.status(200).json({ keywords });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const saveCreation = async (req, res) => {
  const { createdBy, prompt, photo, caption, keywords } = req.body.form;
  const { sharing, imageSize, dalleVersion } = req.body;
  try {
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newCreation = await Creation.create({
      createdBy,
      prompt,
      photo: photoUrl.url,
      caption,
      keywords,
      sharing,
      imageSize,
      model: dalleVersion === 'Dall-E-2' ? 'dall-e-2' : 'dall-e-3',
    });
    res.status(201).json({ success: true, data: newCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const fetchAllCreations = async (req, res) => {
  try {
    const creations = await Creation.find().populate('createdBy', 'name');
    res.status(200).json(creations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const fetchSharedCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ sharing: true }).populate(
      'createdBy',
      'name'
    );
    res.status(200).json(creations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const fetchUserCreations = async (req, res) => {
  const { _id } = req.body;
  try {
    const creations = await Creation.find({ createdBy: _id }).populate(
      'createdBy',
      'name'
    );
    const likedCreations = await Creation.find({ likes: { $in: [_id] } });
    res.status(200).json({ creations, likedCreations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const fetchRandomCreations = async (req, res) => {
  try {
    const randomCreations = await Creation.aggregate([
      { $sample: { size: 16 } },
      { $project: { _id: 0, id: '$_id', src: '$photo' } },
    ]);

    res.status(200).json(randomCreations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const downloadCreation = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    const creation = await Creation.findByIdAndUpdate(
      _id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    res.status(200).json(creation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const likeCreation = async (req, res) => {
  const { userId, _id } = req.body;
  try {
    const creation = await Creation.findByIdAndUpdate(
      _id,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('likes', '_id name profileImage');
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.status(200).json(creation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const unlikeCreation = async (req, res) => {
  const { userId, _id } = req.body;
  try {
    const creation = await Creation.findByIdAndUpdate(
      _id,
      { $pull: { likes: userId } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { likes: -1 } },
      { new: true }
    );
    res.status(200).json(creation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};
