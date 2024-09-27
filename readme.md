# Overview

API URL
https://api.openweathermap.org/data/3.0/onecall/overview?lat={lat}&lon={lon}&appid={API key}

Zip Code/LatLong Lookup
http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}

<div class="container">
      <!-- <div class="response-area">
        <p></p>
      </div> -->
      <form id="weatherForm" method="post">
        <label for="lookup">Use your zip code to see the forecast:</label>
        <input type="text" id="idInput" name="id" />
        <input
          id="get"
          type="submit"
          value="SUBMIT"
          formaction="/get-weather"
        />
      </form>
    </div>
