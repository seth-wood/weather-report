import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const apiKey = "8d25792b1841b7ea7019d3dd0d586d9c";
const API_URL = "https://api.openweathermap.org/data/3.0/onecall/overview?";
const zipLookup = "http://api.openweathermap.org/geo/1.0/zip?";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/get-weather", async (req, res) => {
  const zipCode = req.body.id;
  try {
    const result1 = await axios.get(
      zipLookup + `zip=${zipCode},US&appid=${apiKey}`
    );
    const latitude = result1.data.lat;
    const longitude = result1.data.lon;
    const result2 = await axios.get(
      API_URL +
        `lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
    );
    res.json({ success: true, forecast: result2.data.weather_overview });
  } catch (error) {
    res.json({ success: false, error: error.response.data });
  }
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});