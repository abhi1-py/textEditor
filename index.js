const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

app.post('/generate-pdf', async (req, res) => {
  const text = req.body.content;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 12,
  });

  const pdfBytes = await pdfDoc.save();

  const fileName = `generated-pdf-${Date.now()}.pdf`;
  const filePath = `./public/${fileName}`;

  fs.writeFileSync(filePath, pdfBytes);

  res.json({ success: true, fileName });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
