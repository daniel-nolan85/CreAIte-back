import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import OpenAIApi from 'openai';
import Creation from '../models/creation.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const openai = new OpenAIApi({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const createImage = async (req, res) => {
  const { prompt, imageSize } = req.body;
  try {
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: imageSize,
      response_format: 'b64_json',
    });
    const image = aiResponse.data[0].b64_json;
    const revisedPrompt = aiResponse.data[0].revised_prompt;
    res.status(200).json({ photo: image, revisedPrompt });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createCaption = async (req, res) => {
  const { prompt } = req.body;
  try {
    const message = `Create a caption for an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
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
  const { prompt } = req.body;
  try {
    const message = `Provide some comma separated keywords that will relate to an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
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
  const { sharing, imageSize } = req.body;
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
    });
    res.status(201).json({ success: true, data: newCreation });
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

export const downloadCreation = async (req, res) => {
  const { _id } = req.body;
  try {
    const creation = await Creation.findByIdAndUpdate(
      _id,
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
    res.status(200).json(creation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};
