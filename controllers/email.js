import axios from 'axios';
import nodemailer from 'nodemailer';

export const checkRecaptcha = async (req, res) => {
  const { secret, token } = req.body;

  await axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
};

export const sendUserEmail = async (req, res) => {
  const { form } = req.body;
  const { name, email, subject, message } = form;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nolancode20@gmail.com',
        pass: process.env.GMAIL_AUTHORIZATION,
      },
      secure: true,
    });

    let mailOptions = {
      from: 'nolancode20@gmail.com',
      to: 'nolancode20@gmail.com',
      subject: subject,
      html: `
       <h3>Information</h3>
       <ul>
       <li>Name: ${name}</li>
       <li>Email: ${email}</li>
       </ul>
 
       <h3>Message</h3>
       <p>${message}</p>
       `,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Success');
      }
    });

    transporter.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
