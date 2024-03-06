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
  const { prompt } = req.body;
  console.log({ prompt });
  try {
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });
    console.log('aiResponse => ', aiResponse.data);
    const image = aiResponse.data[0].b64_json;
    const revisedPrompt = aiResponse.data[0].revised_prompt;
    res.status(200).json({ photo: image, revisedPrompt });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createCaption = async (req, res) => {
  const { message } = req.body;
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const caption = res.choices[0].message.content;
    res.status(200).json({ caption });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const createCreation = async (req, res) => {
  const { createdBy, prompt, photo } = req.body.form;
  console.log('req.body => ', req.body);
  try {
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newCreation = await Creation.create({
      createdBy,
      prompt,
      photo: photoUrl.url,
    });
    res.status(201).json({ success: true, data: newCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const fetchCreations = async (req, res) => {
  try {
    const creations = await Creation.find({}).populate('createdBy', 'name');
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
    res.status(200).json(creations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};
