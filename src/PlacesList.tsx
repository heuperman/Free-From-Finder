import React, { useState, useEffect } from "react";
import { Places } from "./Places";
import { RouteComponentProps, navigate } from "@reach/router";

export const PlacesList = (props: RouteComponentProps): JSX.Element => {
  const [position, setPosition] = useState<Position>();
  const [positionError, setPositionError] = useState<PositionError>();
  const [noStoredPosition, setNoStoredPosition] = useState<boolean>(false);
  useEffect(() => {
    if (position) {
      sessionStorage.setItem("lat", position.coords.latitude.toString());
      sessionStorage.setItem("lon", position.coords.longitude.toString());
    }
  }, [position]);
  useEffect(() => {
    const storedLatitude = sessionStorage.getItem("lat");
    const storedLongitude = sessionStorage.getItem("lon");
    if (storedLatitude && storedLongitude) {
      setPosition({
        coords: {
          latitude: +storedLatitude,
          longitude: +storedLongitude,
          accuracy: null,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: null
      });
    } else {
      setNoStoredPosition(true);
    }
  }, []);

  const onLocationSucces = (currentPosition: Position): void => {
    setPosition(currentPosition);
  };

  const onLocationError = (error: PositionError): void => {
    setPositionError(error);
  };

  const getPosition = (): void => {
    navigator.geolocation.getCurrentPosition(
      onLocationSucces,
      onLocationError,
      { timeout: 5000 }
    );
  };

  return position ? (
    <div>
      <Places />
      <button onClick={(): Promise<void> => navigate("/places/new")}>
        Add a new place
      </button>
    </div>
  ) : noStoredPosition ? (
    <div className="center-text">
      <h1>Free From Finder</h1>
      <button onClick={getPosition}>Find places near me</button>
      {positionError && (
        <h2 className="error-message">
          Please allow location access to see nearby places
        </h2>
      )}
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};