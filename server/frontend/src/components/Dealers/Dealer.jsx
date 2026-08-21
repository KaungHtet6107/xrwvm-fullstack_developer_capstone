import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import "./Dealers.css";
import "../assets/style.css";

import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

import Header from '../Header/Header';


const Dealer = () => {

  // ============================================================
  // State
  // ============================================================

  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [loading, setLoading] = useState(true);


  // ============================================================
  // Get dealer ID from URL
  //
  // Example:
  // /dealer/1
  //
  // id = 1
  // ============================================================

  const { id } = useParams();


  // ============================================================
  // API URLs
  // ============================================================

  const dealer_url = `/djangoapp/dealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;


  // ============================================================
  // Get Dealer Details
  // ============================================================

  const get_dealer = async () => {

    try {

      console.log("Getting dealer:", dealer_url);

      const res = await fetch(dealer_url, {
        method: "GET"
      });

      if (!res.ok) {
        throw new Error(
          `Dealer API returned HTTP ${res.status}`
        );
      }

      const retobj = await res.json();

      console.log("Dealer API response:", retobj);

      if (retobj.status === 200) {

        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * Array.from(retobj.dealer)
         *
         * The dealer returned by Django is normally an object.
         */

        setDealer(retobj.dealer);

      } else {

        console.error(
          "Dealer API returned an error:",
          retobj
        );

      }

    } catch (error) {

      console.error(
        "Error getting dealer:",
        error
      );

    }
  };


  // ============================================================
  // Get Dealer Reviews
  // ============================================================

  const get_reviews = async () => {

    try {

      console.log("Getting reviews:", reviews_url);

      const res = await fetch(reviews_url, {
        method: "GET"
      });

      if (!res.ok) {
        throw new Error(
          `Reviews API returned HTTP ${res.status}`
        );
      }

      const retobj = await res.json();

      console.log(
        "Reviews API response:",
        retobj
      );

      if (retobj.status === 200) {

        if (
          retobj.reviews &&
          retobj.reviews.length > 0
        ) {

          setReviews(retobj.reviews);
          setUnreviewed(false);

        } else {

          setReviews([]);
          setUnreviewed(true);

        }

      } else {

        console.error(
          "Reviews API returned an error:",
          retobj
        );

      }

    } catch (error) {

      console.error(
        "Error getting reviews:",
        error
      );

      setUnreviewed(true);
    }
  };


  // ============================================================
  // Sentiment Icon
  // ============================================================

  const senti_icon = (sentiment) => {

    if (sentiment === "positive") {
      return positive_icon;
    }

    if (sentiment === "negative") {
      return negative_icon;
    }

    return neutral_icon;
  };


  // ============================================================
  // Load Dealer + Reviews
  // ============================================================

  useEffect(() => {

    get_dealer();
    get_reviews();

  }, [id]);


  // ============================================================
  // Render
  // ============================================================

  return (

    <div style={{ margin: "20px" }}>

      <Header />


      {/* ======================================================
          Dealer Information
      ====================================================== */}

      <div style={{ marginTop: "10px" }}>

        <h1 style={{ color: "grey" }}>

          {dealer.full_name || "Dealer"}

          {/* --------------------------------------------------
              Show Post Review button only when logged in
          -------------------------------------------------- */}

          {sessionStorage.getItem("username") && (

            <a
              href={`/postreview/${id}`}
            >

              <img
                src={review_icon}
                style={{
                  width: "10%",
                  marginLeft: "10px",
                  marginTop: "10px"
                }}
                alt="Post Review"
              />

            </a>

          )}

        </h1>


        <h4 style={{ color: "grey" }}>

          {dealer.city || ""}
          {dealer.city && dealer.address ? ", " : ""}
          {dealer.address || ""}

          {dealer.zip
            ? `, Zip - ${dealer.zip}`
            : ""
          }

          {dealer.state
            ? `, ${dealer.state}`
            : ""
          }

        </h4>

      </div>


      {/* ======================================================
          Reviews
      ====================================================== */}

      <div className="reviews_panel">

        {/* Loading */}

        {loading && reviews.length === 0 && !unreviewed ? (

          <div>
            Loading Reviews....
          </div>

        ) : unreviewed ? (

          /* No reviews */

          <div>
            No reviews yet!
          </div>

        ) : (

          /* Reviews */

          reviews.map((review, index) => (

            <div
              className="review_panel"
              key={index}
            >

              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />


              <div className="review">
                {review.review}
              </div>


              <div className="reviewer">

                {review.name || ""}

                {" "}

                {review.car_make || ""}

                {" "}

                {review.car_model || ""}

                {" "}

                {review.car_year || ""}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};


export default Dealer;