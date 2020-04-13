import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker , Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

require('dotenv').config();

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    latitude: 37.6,
    longitude: -95.667,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  }
  useEffect(() => {
    (async () => {
      // this is called only once i.e. when the component loads...
     getEntries();
    })();

    return () => {
      // clean up things...
    }
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken='pk.eyJ1IjoiYWthcHVyIiwiYSI6ImNqcm90Y2YzbjBkMDU0OXFldTQwb3lsbGgifQ.6NOQtDQeICHMpv6F04-yrg'
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
      >
        {
          logEntries.map(entry => (
            <React.Fragment key={entry._id}>
            <Marker 
              latitude={entry.latitude} 
              longitude={entry.longitude} 
              offsetLeft={-20}
              offsetTop={-10}>
              <div 
                onClick={() => setShowPopup({
                  showPopup, 
                   [entry._id]: true, 
                })}>
                 <img 
                   className="marker"
                   style={{
                     height: `${4 * viewport.zoom}px`,
                     width: `${4 * viewport.zoom}px`,
                   }}
                   src="http://i.imgur.com/y0G5YTX.png"
                   alt="marker"
                   />
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude} 
                  longitude={entry.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopup({})}
                  anchor="top">
                    <div>
                      <h3>{entry.title}</h3>
                      <p>{entry.comments}</p>
                      <small>Visited On: {new Date(entry.visitDate).toLocaleDateString()}</small>
                      { entry.image && <img className="popup-img" src={entry.image} alt={entry.title}></img>}
                    </div>
                </Popup> ) : null
            }
            </React.Fragment>
          ))
        }
        {
          addEntryLocation ? (
            <>
              <Marker 
                latitude={addEntryLocation.latitude} 
                longitude={addEntryLocation.longitude} 
              >
              <div 
                onClick={() => setAddEntryLocation({
                  showPopup, 
                  addEntryLocation: true, 
                })}>
                 <img 
                   className="marker"
                   style={{
                     height: `${4 * viewport.zoom}px`,
                     width: `${4 * viewport.zoom}px`,
                   }}
                   src="http://i.imgur.com/y0G5YTX.png"
                   alt="marker"
                   />
              </div>
              </Marker>
                <Popup
                  latitude={addEntryLocation.latitude} 
                  longitude={addEntryLocation.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setAddEntryLocation(null)}
                  anchor="top">
                    <div>
                      <LogEntryForm onClose={() => {
                        setAddEntryLocation(null);
                        getEntries();
                      }} location={addEntryLocation} />
                    </div>
                </Popup> 
              </> 
            ) : null
            }
      </ReactMapGL>
    
  );
}

export default App;
