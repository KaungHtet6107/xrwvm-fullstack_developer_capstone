import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import "./Dealers.css";
import "../assets/style.css";

import Header from '../Header/Header';


const PostReview = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);


  // ========================================================
  // Build URLs
  // ========================================================

  const root_url = window.location.origin + "/";

  const dealer_url =
    root_url + `djangoapp/dealer/${id}`;

  const review_url =
    root_url + "djangoapp/add_review";

  const carmodels_url =
    root_url + "djangoapp/get_cars";


  // ========================================================
  // Get Dealer
  // ========================================================

  const get_dealer = async () => {

    try {

      const res = await fetch(
        dealer_url,
        {
          method: "GET"
        }
      );

      const retobj = await res.json();

      if (retobj.status === 200) {

        const dealerobjs = Array.from(
          retobj.dealer || []
        );

        if (dealerobjs.length > 0) {

          setDealer(dealerobjs[0]);

        }

      }

    } catch (error) {

      console.error(
        "Error getting dealer:",
        error
      );

    }

  };


  // ========================================================
  // Get Cars
  // ========================================================

  const get_cars = async () => {

    try {

      const res = await fetch(
        carmodels_url,
        {
          method: "GET"
        }
      );

      const retobj = await res.json();

      if (retobj.CarModels) {

        setCarmodels(
          Array.from(retobj.CarModels)
        );

      }

    } catch (error) {

      console.error(
        "Error getting cars:",
        error
      );

    }

  };


  // ========================================================
  // Post Review
  // ========================================================

  const postreview = async () => {

    // Check login
    const username =
      sessionStorage.getItem("username");

    if (!username) {

      alert(
        "Please log in before posting a review."
      );

      navigate("/login");

      return;

    }


    // Get user's name
    let firstname =
      sessionStorage.getItem("firstname");

    let lastname =
      sessionStorage.getItem("lastname");

    let name =
      `${firstname || ""} ${lastname || ""}`.trim();


    // If first/last name is unavailable,
    // use username.
    if (!name || name.includes("null")) {

      name = username;

    }


    // Validate fields
    if (
      !model ||
      review.trim() === "" ||
      date === "" ||
      year === ""
    ) {

      alert(
        "All details are mandatory"
      );

      return;

    }


    // ====================================================
    // Split Car Make and Model
    // ====================================================

    const model_split =
      model.split(" ");

    const make_chosen =
      model_split[0];

    const model_chosen =
      model_split.slice(1).join(" ");


    // ====================================================
    // Prepare JSON
    // ====================================================

    const jsoninput = JSON.stringify({

      name: name,

      dealership: parseInt(id),

      review: review,

      purchase: true,

      purchase_date: date,

      car_make: make_chosen,

      car_model: model_chosen,

      car_year: parseInt(year)

    });


    console.log(
      "Submitting review:",
      jsoninput
    );


    // ====================================================
    // Send POST request
    // ====================================================

    try {

      const res = await fetch(
        review_url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: jsoninput
        }
      );


      const json =
        await res.json();


      console.log(
        "Review response:",
        json
      );


      // ==================================================
      // Success
      // ==================================================

      if (json.status === 200) {

        alert(
          "Review posted successfully!"
        );

        navigate(
          `/dealer/${id}`
        );

      }

      // ==================================================
      // Unauthorized
      // ==================================================

      else if (json.status === 403) {

        alert(
          "Please log in before posting a review."
        );

        navigate("/login");

      }

      // ==================================================
      // Other errors
      // ==================================================

      else {

        alert(
          json.message ||
          "Error posting review."
        );

      }

    } catch (error) {

      console.error(
        "Error posting review:",
        error
      );

      alert(
        "Unable to post review."
      );

    }

  };


  // ========================================================
  // Load page data
  // ========================================================

  useEffect(() => {

    get_dealer();

    get_cars();

  }, [id]);


  // ========================================================
  // Render
  // ========================================================

  return (

    <div>

      <Header />


      <div
        style={{
          margin: "5%"
        }}
      >

        {/* Dealer name */}

        <h1
          style={{
            color: "darkblue"
          }}
        >
          {dealer.full_name}
        </h1>


        {/* Review */}

        <div
          className="input_field"
        >

          <label>
            Review
          </label>

          <br />

          <textarea
            id="review"
            cols="50"
            rows="7"
            value={review}
            onChange={
              (e) =>
                setReview(e.target.value)
            }
          />

        </div>


        {/* Purchase date */}

        <div
          className="input_field"
        >

          Purchase Date

          <input
            type="date"
            value={date}
            onChange={
              (e) =>
                setDate(e.target.value)
            }
          />

        </div>


        {/* Car make/model */}

        <div
          className="input_field"
        >

          Car Make / Model

          <select
            name="cars"
            id="cars"
            value={model}
            onChange={
              (e) =>
                setModel(e.target.value)
            }
          >

            <option
              value=""
              disabled
            >
              Choose Car Make and Model
            </option>


            {carmodels.map(
              (carmodel, index) => (

                <option
                  key={index}
                  value={
                    `${carmodel.CarMake} ${carmodel.CarModel}`
                  }
                >

                  {carmodel.CarMake}
                  {" "}
                  {carmodel.CarModel}

                </option>

              )
            )}

          </select>

        </div>


        {/* Car year */}

        <div
          className="input_field"
        >

          Car Year

          <input
            type="number"
            value={year}
            min="2015"
            max="2026"
            onChange={
              (e) =>
                setYear(e.target.value)
            }
          />

        </div>


        {/* Submit */}

        <div>

          <button
            className="postreview"
            onClick={postreview}
          >
            Post Review
          </button>

        </div>

      </div>

    </div>

  );

};


export default PostReview;