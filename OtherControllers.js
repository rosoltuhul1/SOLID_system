const express = require('express');
/*const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;*/
const db = require('../database.js');
const axios = require('axios');

//////////////////////////////
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');
});

exports.getAirQualityData = async (req, res) => {
  try {
    const { city } = req.params; // Assuming the city parameter is part of the route

    const apiKey = 'fc78157dbfb9a2dce1aaf70d03a9b4eb';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    const airQuality = response.data?.main?.aqi;

    // Send the response back to the client
    res.json({ status: 'success', airQuality });
  } catch (error) {
    console.error('Error fetching data from OpenWeatherMap:', error.message);
    // Handle errors and send an error response
    res.status(500).json({ status: 'error', message: 'Failed to fetch air quality data.' });
  }
};

/////////////////////////API
/*exports.getAirQualityData=(req,res)=>{

async function getAirQualityData(city) {
  try {
    const apiKey = 'fc78157dbfb9a2dce1aaf70d03a9b4eb';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    const airQuality = response.data?.main?.aqi;

    return airQuality;
  } catch (error) {
    console.error('Error fetching data from OpenWeatherMap:', error.message);
    throw error;
  }
}

module.exports = {
  getAirQualityData,
};

  /*
// Import necessary modules
//const axios = require('axios');

// Function to get air quality data from external API
async function getAirQualityData(city) {
  try {
    // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
    const apiKey = 'fc78157dbfb9a2dce1aaf70d03a9b4eb';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Make a GET request to the API
    const response = await axios.get(apiUrl);

    // Log the entire API response
    console.log('API Response:', response.data);

    // Extract air quality information from the API response
    const airQuality = response.data?.main?.aqi;

    // Return the air quality data
    return airQuality;
  } catch (error) {
    // Handle errors
    console.error('Error fetching data from OpenWeatherMap:', error.message);
    throw error; // You can choose to handle or propagate the error based on your requirements
  }
}

// Example usage
const city = 'Nablus';
getAirQualityData(city)
  .then(airQuality => {
    // Process the air quality data as needed
    console.log('Air Quality:', airQuality);
  })
  .catch(error => {
    // Handle errors
    console.error('Error getting air quality data:', error.message);
  });*/

//};*/
//const userAuth = require('../controllers/Login.js'); 
////////////////////////////////
exports.GetFriends = (req, res) => {
  const userID = require('./Login'); // Make sure the Login module exports userID correctly
  const ProfileID = req.params.id;

  db.query('SELECT Interests FROM userprofile WHERE User_ID=?', [userID], async (err, results) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const interestsMap = {};

      for (let j = 0; j < results.length; j++) {
        try {
          const results2 = await new Promise((resolve, reject) => {
            db.query('SELECT User_ID, Interests FROM userprofile WHERE User_ID!=? AND Interests=?', [userID, results[j].Interests], async (err, results2) => {
              if (err) {
                console.error('Error fetching user profiles:', err);
                reject(err);
              } else {
                resolve(results2);
              }
            });
          });

          for (let i = 0; i < results2.length; i++) {
            try {
              const friendss = await new Promise((resolve, reject) => {
                db.query('SELECT User_ID, Username FROM user WHERE User_ID=?', [results2[i].User_ID], (err, friendss) => {
                  if (err) {
                    console.error(`Error fetching friends:`, err);
                    reject(err);
                  } else {
                    console.log(`Done fetching friends:`, friendss);

                    // Group friends by interest
                    if (!interestsMap[results[j].Interests]) {
                      interestsMap[results[j].Interests] = [];
                    }

                    interestsMap[results[j].Interests].push({
                      User_ID: friendss[0].User_ID,
                      Username: friendss[0].Username,
                    });

                    resolve(friendss);
                  }
                });
              });
            } catch (error) {
              console.error('Error in inner loop:', error);
            }
          }

          console.log('Interests Map after inner loop:', interestsMap);
        } catch (error) {
          console.error('Error in outer loop:', error);
        }
      }

      console.log('Interests Map after outer loop:', interestsMap);

      // Send the response to Postman
      res.json(interestsMap);
    }
  });
};


/*
exports.GetFriends = (req, res) => {
  const userID = require('./Login');

  const ProfileID = req.params.id;
  db.query('SELECT Interests FROM userprofile WHERE User_ID=?',[userID], async (err, results) => {
       if (err) {
         console.error('Error fetching user profiles:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
        const allFriendS = [];

            // Iterate over each user profile  
            const allResults = [];

            for (let j = 0; j < results.length; j++) {
              const result11 = await new Promise((resolve, reject) => {
        db.query('SELECT User_ID,Interests FROM userprofile WHERE User_ID!=? AND Interests=?',[userID,results[j].Interests], async (err, results2) => {
          if (err) {
            console.error('Error fetching user profiles:', err);
            //res.status(500).json({ error: 'Internal Server Error' });
            reject(err);
          } else {
           // console.log(`Done Get friends `, friendss);
                    resolve(results2);
           // console.log(results.length);
         //   allFriendS.push(results2);

          
            // Iterate over each user profile
            for (let i = 0; i < results2.length; i++) {
              const resultss = await new Promise((resolve, reject) => {
                // Use database query inside the loop
                db.query('SELECT User_ID , Username FROM user WHERE User_ID=?', [results2[i].User_ID], (err, friendss) => {
                  if (err) {
                    console.error(`Error fetching friendss  `, err);
                    reject(err);
                  } else {
                    console.log(`Done Get friends `, friendss);
                    resolve(friendss);
                  }
                });
              });
        
              // Store the results for each user, including alert messages
              allResults.push({ Interest :results[j].Interests,Friends: resultss });
            }
        
            // Handle the results for all users
            console.log('result2', results2)
            console.log('ALl All results:', allResults);
            
          }
        });})
        console.log('Done loop ALl All results:', allResults);
      }

      console.log('After All results:', allResults);

       // res.json(allFriendS);
      // res.json(allResults);
        // res.json(results);
       }
     });
};*/
///////////////////////Educational Resources Table////////////////////////////
exports.GetResources = (req, res) => {

   db.query('SELECT * FROM educationalresources', (err, results) => {
        if (err) {
          console.error('Error fetching Resources:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      });
};

exports.PostResources = (req, res) => {
    const {Resource_ID, Title,Content,Author,Tags } = req.body;
    const Timestamp = new Date();
    const userID = require('./Login');
    const dataId = req.params.id;
    db.query('SELECT Description FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to insert resources' );
      }
       else{
    db.query('INSERT INTO educationalresources (Resource_ID, Title , Content,Timestamp,Author,Tags) VALUES (?,?, ?, ?,?,?)', [Resource_ID, Title,Content,Timestamp,Author,Tags], (err, result) => {
      if (err) {
        console.error('Error creating Resources:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Resource added successfully', Resource_ID: result.insertId });
      }
    });
   }
   });
   };

exports.UpdateResources = (req, res) => {
    const Resourceid = req.params.id;
    const {Resource_ID, Title,Content,Author,Tags } = req.body;
    const Timestamp = new Date();
    const userID = require('./Login');
    const dataId = req.params.id;
    db.query('SELECT Description FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to update resources' );
      }
       else{
    db.query('UPDATE educationalresources SET Title=?, Content=?, Timestamp=? , Author=? , Tags=? WHERE Resource_ID=?', [Title,Content,Timestamp,Author,Tags, Resourceid], (err, result) => {
      if (err) {
        console.error('Error updating Resource:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Resource updated successfully', rowsAffected: result.affectedRows });
      }
    });
   }
   });
   
   
   };

exports.DeleteResources = (req, res) => {
    const Resourceid = req.params.id;
    const userID = require('./Login');
    const dataId = req.params.id;
    db.query('SELECT Description FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to delete resources' );
      }
       else{
    db.query('DELETE FROM educationalresources WHERE Resource_ID=?', [Resourceid], (err, result) => {
      if (err) {
        console.error('Error deleting Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Resource deleted successfully', rowsAffected: result.affectedRows });
      }
    });
   }
   });
   
   
   };


/////////////////////////////////Community Report////////////////////////////////////////////
exports.GetReport = (req, res) => { 
  const myGlobalInteger = require('./Login');
  db.query('SELECT * FROM CommunityReports', (err, results) => {
       if (err) {
         console.error('Error fetching CommunityReports:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
       // console.log(myGlobalInteger);
       // res.json(myGlobalInteger);
         res.json(results);
       }
     });
    
};
exports.PostReport = (req, res) => {
  const userID = require('./Login');
  console.log(req.body); 
  const {User_ID , Report_Message, Environmental_Issue_Type, Location } = req.body;
  //const userid= userAuth.getLoggedInUserId();

  const Timestamp = new Date(); // Create a new Date object to get the current timestamp

  // Remove Report_ID from here since it's an AUTO_INCREMENT field in the table
  db.query('INSERT INTO communityreports (User_ID, Timestamp, Report_Message, Environmental_Issue_Type, Location) VALUES (?,?,?,?,?)', [userID, Timestamp, Report_Message, Environmental_Issue_Type, Location], (err, result) => {
      if (err) {
          console.error('Error creating CommunityReports:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.json({ message: 'Report created successfully', ReportId: result.insertId });
      }
  });
};

exports.UpdateReport = (req, res) => {
  const userID = require('./Login');
  const ReportId = req.params.id;
  const { User_ID, Report_Message, Environmental_Issue_Type, Location } = req.body;
  const Timestamp = new Date();

  db.query('UPDATE communityreports SET  User_ID=?, Timestamp=?, Report_Message=? ,Environmental_Issue_Type=? ,Location=?  WHERE Report_ID=?', [ userID, Timestamp, Report_Message ,  Environmental_Issue_Type , Location,ReportId], (err, result) => {
    if (err) {
      console.error('Error updating Reports:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Report updated successfully', rowsAffected: result.affectedRows });
    }
  });
};
exports.DeleteReport = (req, res) => {
  const ReportId = req.params.id;

  db.query('DELETE FROM communityreports WHERE Report_ID=?', [ReportId], (err, result) => {
    if (err) {
      console.error('Error deleting Report:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Report deleted successfully', rowsAffected: result.affectedRows });
    }
  });
};

exports.DeleteReportbyuserid = (req, res) => {
  const userid = require('./Login');
  db.query('DELETE FROM communityreports WHERE User_ID=?', [userid], (err, result) => {
    if (err) {
      console.error('Error deleting Report:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Report deleted successfully', rowsAffected: result.affectedRows });
    }
  });
};

exports.GetReportByID = (req, res) => {
  const ReportId = req.params.id;
  const { User_ID, Report_Message, Environmental_Issue_Type, Location } = req.body;
  const Timestamp = new Date();
  
  db.query('SELECT *FROM CommunityReports WHERE Report_ID=?',[ReportId], (err, results) => {
    if (err) {
      console.error('Error fetching CommunityReports:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
    // console.log(myGlobalInteger);
    // res.json(myGlobalInteger);
      res.json(results);
    }
  });
};

exports.GetReportByUserID = (req, res) => {
  const userid = require('./Login');
 // const userid1 = req.params.id;

  const { User_ID, Report_Message, Environmental_Issue_Type, Location } = req.body;
  const Timestamp = new Date();
  
  db.query('SELECT *FROM CommunityReports WHERE User_ID=?',[userid], (err, results) => {
    if (err) {
      console.error('Error fetching CommunityReports:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
    // console.log(myGlobalInteger);
    // res.json(myGlobalInteger);
      res.json(results);
      //res.json(userid);

    }
  });
};


/////////////////////////////////Data Resources/////////////////////////////
exports.GetData = (req, res) => { 
  db.query('SELECT * FROM opendataaccess', (err, results) => {
       if (err) {
         console.error('Error fetching opendataaccess:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
         res.json(results);
       }
     });
};
exports.PostData = (req, res) => {
   console.log(req.body); 
   const { Access_ID, Researcher_ID, Data_Request_Details, status } = req.body;
   const Timestamp = new Date();
   // Remove Report_ID from here since it's an AUTO_INCREMENT field in the table
   db.query('INSERT INTO opendataaccess (Access_ID, Researcher_ID, Timestamp, Data_Request_Details, status) VALUES (?,?,?,?,?)', [Access_ID, Researcher_ID, Timestamp, Data_Request_Details, status], (err, result) => {
       if (err) {
           console.error('Error creating opendataaccess:', err);
           res.status(500).json({ error: 'Internal Server Error' });
       } else {
           res.json({ message: 'Data created successfully', dataId: result.insertId });
       }
   });
};

exports.UpdateData = (req, res) => {
 
   const dataId = req.params.id;
   const { Access_ID, Researcher_ID,  Data_Request_Details, status } = req.body;  
   const Timestamp = new Date();

   db.query('UPDATE opendataaccess SET   Researcher_ID=?, Timestamp=?, Data_Request_Details=? ,status=?  WHERE Access_ID=?', [Researcher_ID,User_ID, Timestamp, Data_Request_Details ,  status], (err, result) => {
     if (err) {
       console.error('Error updating Data:', err);
       res.status(500).json({ error: 'Internal Server Error' });
     } else {
       res.json({ message: 'Data updated successfully', rowsAffected: result.affectedRows });
     }
   });
};
exports.DeleteData = (req, res) => {
   const dataId = req.params.id;

   db.query('DELETE FROM opendataaccess WHERE Report_ID=?', [dataId], (err, result) => {
     if (err) {
       console.error('Error deleting Data:', err);
       res.status(500).json({ error: 'Internal Server Error' });
     } else {
       res.json({ message: 'Data deleted successfully', rowsAffected: result.affectedRows });
     }
   });
};

////////////////////////////////////Sus.Score//////////////////////////////////

exports.GetUserSus = (req, res) => {
   db.query('SELECT User_ID,Score_Value FROM sustainabilityscore', (err, results) => {
        if (err) {
          console.error('Error fetching sustainabilityscore:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      });
};
exports.PostUserSus = (req, res) => {
  
  const userID = require('./Login');
    const { Score_ID, User_ID,Score_Value } = req.body;
    const Timestamp = new Date();
db.query('INSERT INTO sustainabilityscore (Score_ID , User_ID, Timestamp, Score_Value) VALUES (?,?, ?, ?)', [ Score_ID, userID,Timestamp,Score_Value], (err, result) => {
    if (err) {
      console.error('Error creating sustainabilityscore:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else 
    {
     
      res.json({ message: 'sustainabilityscore created successfully', ScoreId: result.insertId });
      
    }
    
  });

};
//db.query = INSERT INTO sustainabilityscore (Score_ID, User_ID, Timestamp, Score_Value) VALUES ('${Score_ID}', '${User_ID}', '${Timestamp}', '${Score_Value}'), (err, result) =>{
   

exports.UpdateUserSus = (req, res) => {
  const userID = require('./Login');
    const ScoreId = req.params.id;
    const { Score_ID, User_ID,Score_Value } = req.body;
    const Timestamp = new Date();
    db.query('UPDATE sustainabilityscore SET User_ID=?, Timestamp=?, Score_Value=? WHERE Score_ID=?', [userID, Timestamp, Score_Value, ScoreId], (err, result) => {
      if (err) {
        console.error('Error updating sustainabilityscore:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'SustainabilityScore updated successfully', rowsAffected: result.affectedRows });
      }
    });
};
exports.DeleteUserSus = (req, res) => {
    const ScoreId = req.params.id;

    db.query('DELETE FROM sustainabilityscore WHERE Score_ID=?', [ScoreId], (err, result) => {
      if (err) {
        console.error('Error deleting sustainabilityscore:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'sustainabilityscore deleted successfully', rowsAffected: result.affectedRows });
      }
    });
};



///////////////////////Enviromental data////////////////////////
exports.GetEnviromental = (req, res) => {
  db.query('SELECT * FROM environmentaldata', (err, results) => {
       if (err) {
         console.error('Error fetching environmentaldata:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
         res.json(results);
       }
     });
};

exports.GetEnviromentalByUser = (req, res) => {
  const userID = require('./Login');
  db.query('SELECT * FROM environmentaldata WHERE User_ID=?', [userID ],(err, results) => {
    if (results[0].Description !=='R') {
      console.log(results);
      res.json(  'You are not Researcher' );
    } else if (err) 
    {
         console.error('Error fetching environmentaldata:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else 
       {
         res.json(results);
       }
     });
};
exports.PostEnviromental = (req, res) => {

 const userID = require('./Login');
 const Timestamp = new Date();
 db.query('SELECT Description,Location FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
  if (results[0].Description !=='R') {
    console.log(results);
    res.json(  'You are not allowed to insert data' );
  } else 
  {
 const { Data_ID, User_ID, Air_Quality, Temperature, Humidity, Water_Quality, Biodiversity_Metrics } = req.body;
db.query('INSERT INTO environmentaldata (Data_ID, User_ID, Timestamp, Air_Quality, Temperature, Humidity, Water_Quality, Biodiversity_Metrics) VALUES (?,?, ?, ?,?,?,?,?)', [ Data_ID, userID,Timestamp ,Air_Quality, Temperature, Humidity, Water_Quality, Biodiversity_Metrics], (err, result) => {
   if (err) {
     console.error('Error creating environmentaldata:', err);
     res.status(500).json({ error: 'Internal Server Error' });
   } else {
     
    var Location=results[0].Location;   
    const isAirQuality1000 = Air_Quality === 10000;
    const isTemperature1000 = Temperature === 10000;
    const isHumidity1000 = Humidity === 10000;
    const isWaterQuality1000 = Water_Quality === 10000;
    const isBiodiversityMetrics1000 = Biodiversity_Metrics === 10000;
    console.log('Location:', Location);
    console.log('isAirQuality1000:', isAirQuality1000);
    console.log('isTemperature1000:', isTemperature1000);
    console.log('isHumidity1000:', isHumidity1000);
    console.log('isWaterQuality1000:', isWaterQuality1000);
    console.log('isBiodiversityMetrics1000:', isBiodiversityMetrics1000);
   if(isAirQuality1000==false){

    const Timestamp = new Date();
    const {Alert_ID, User_ID, Alert_Message , interest } = req.body;

    db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location) VALUES (?,?, ?, ?, ?,?)', [Alert_ID , userID, Timestamp, "Air quality value is updated","Air_Quality",Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
       else {

       /* db.query('SELECT * FROM sustainabilityscore', (err, res) => {
          if (err) {
            console.error('Error fetching sustainabilityscore:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } 
          else {
            const { Score_ID, User_ID,Score_Value } = req.body;
            const Timestamp = new Date();
            db.query('UPDATE sustainabilityscore SET User_ID=?, Timestamp=?, Score_Value=? WHERE Score_ID=?', [userID, Timestamp, 1+(res[0].Score_Value), res[0].Score_ID ], (err, result) => {
              if (err) {
                console.error('Error updating sustainabilityscore:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                res.json({ message: 'SustainabilityScore updated successfully', rowsAffected: result.affectedRows });
              }
            });
            //res.json(res);
          }
        });
*/
  //      res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
      }
    });
  }


  if(isTemperature1000==false){

    const Timestamp = new Date();
    const {Alert_ID, User_ID, Alert_Message ,interest } = req.body;

    db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest ,Location) VALUES (?,?, ?,?, ?, ?)', [Alert_ID , userID, Timestamp, "Temperature value is updated","Temperature",Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Done Temp");
    //    res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
      }
    });
  }

  if(isHumidity1000==false){

    const Timestamp = new Date();
    const {Alert_ID, User_ID, Alert_Message, interest  } = req.body;

    db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?, ?, ?,?)', [Alert_ID , userID, Timestamp, "Humidity value is updated","Humidity",Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
       // res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
      }
    });
  }


  if(isWaterQuality1000==false){

    const Timestamp = new Date();
    const {Alert_ID, User_ID, Alert_Message, interest  } = req.body;

    db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?, ?,?, ?)', [Alert_ID , userID, Timestamp, "WaterQuality value is updated","Water_Quality",Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
      //  res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
      }
    });
  }


  if(isBiodiversityMetrics1000==false){

    const Timestamp = new Date();
    const {Alert_ID, User_ID, Alert_Message,interest   } = req.body;

    db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?,?, ?, ?)', [Alert_ID , userID, Timestamp, "BiodiversityMetrics value is updated","Biodiversity_Metrics",Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
       // res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
      }
    });
  }
  db.query('SELECT * FROM sustainabilityscore', (err, results2) => {
    if (err) {
      console.error('Error fetching sustainabilityscore:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
    else {
      const { Score_ID, User_ID,Score_Value } = req.body;
      const Timestamp = new Date();
      db.query('UPDATE sustainabilityscore SET User_ID=?, Timestamp=?, Score_Value=? WHERE Score_ID=?', [userID, Timestamp, results2[0].Score_Value+1, results2[0].Score_ID ], (err, result) => {
        if (err) {
          console.error('Error updating sustainabilityscore:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'SustainabilityScore updated successfully', rowsAffected: result.affectedRows });
        }
      });
      //res.json(results2);
    }
  });
    // res.json({ message: 'environmentaldata created successfully'});
   }
 });
}
});

};

exports.UpdateEnviromental= (req, res) => {
  const userID = require('./Login');
  const dataId = req.params.DataID;
  const { Data_ID, User_ID, Air_Quality, Temperature, Humidity, Water_Quality, Biodiversity_Metrics } = req.body;
    const Timestamp = new Date();
    db.query('SELECT Description,Location FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') 
      {
        console.log(results);
        res.json(  'You are not allowed to update data' );
      }
       else {

    db.query('UPDATE environmentaldata SET User_ID =?, Timestamp=?, Air_Quality=?, Temperature=?, Humidity=?, Water_Quality=?, Biodiversity_Metrics=? WHERE Data_ID=?', [userID,Timestamp ,Air_Quality, Temperature, Humidity, Water_Quality, Biodiversity_Metrics, dataId], (err, result) => {
    
      if (err) {
        console.error('Error updating environmentaldata:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
      
      else {
  var Location=results[0].Location;
        const isAirQuality1000 = Air_Quality === 1000;
        const isTemperature1000 = Temperature === 1000;
        const isHumidity1000 = Humidity === 1000;
        const isWaterQuality1000 = Water_Quality === 1000;
        const isBiodiversityMetrics1000 = Biodiversity_Metrics === 1000;
    
       if(isAirQuality1000==false){
    
        const Timestamp = new Date();
        const {Alert_ID, User_ID, Alert_Message ,interest  } = req.body;
    
        db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?,?, ?, ?)', [Alert_ID , userID, Timestamp, "Air quality value is updated","Air_Quality",Location], (err, result) => {
          if (err) {
            console.error('Error creating Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
          }
        });
      }
    
    
      if(isTemperature1000==false){
    
        const Timestamp = new Date();
        const {Alert_ID, User_ID, Alert_Message,interest   } = req.body;
    
        db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?, ?, ?)', [Alert_ID , userID, Timestamp, "Temperature value is updated","Temperature",Location], (err, result) => {
          if (err) {
            console.error('Error creating Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
          }
        });
      }
    
      if(isHumidity1000==false){
    
        const Timestamp = new Date();
        const {Alert_ID, User_ID, Alert_Message,interest   } = req.body;
    
        db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?, ?, ?,?, ?)', [Alert_ID , userID, Timestamp, "Humidity value is updated","Humidity",Location], (err, result) => {
          if (err) {
            console.error('Error creating Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
          }
        });
      }
    
    
      if(isWaterQuality1000==false){
    
        const Timestamp = new Date();
        const {Alert_ID, User_ID, Alert_Message,interest   } = req.body;
    
        db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?,?, ?, ?, ?)', [Alert_ID , userID, Timestamp, "WaterQuality value is updated","Water_Quality",Location], (err, result) => {
          if (err) {
            console.error('Error creating Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
          }
        });
      }
    
    
      if(isBiodiversityMetrics1000==false){
    
        const Timestamp = new Date();
        const {Alert_ID, User_ID, Alert_Message,interest   } = req.body;
    
        db.query('INSERT INTO environmentalalerts (Alert_ID ,User_ID ,Timestamp,Alert_Message,interest , Location ) VALUES (?,?,?, ?, ?, ?)', [Alert_ID , userID, Timestamp, "BiodiversityMetrics value is updated","Biodiversity_Metrics",Location], (err, result) => {
          if (err) {
            console.error('Error creating Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Alert added successfully', Alert_ID: result.insertId });
          }
        });
      }
    
        res.json({ message: 'environmentaldata updated successfully', rowsAffected: result.affectedRows });
      }
    });
   }
   });
   
   
   };
exports.DeleteEnviromental = (req, res) => {
  const userID = require('./Login');
    const dataId = req.params.DataID;
    db.query('SELECT Description FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to delete data' );
      }
       else {
    db.query('DELETE FROM environmentaldata WHERE Data_ID=?', [dataId], (err, result) => {
     
      if (err) {
        console.error('Error deleting environmentaldata:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
      else {
        res.json({ message: 'environmentaldata deleted successfully', rowsAffected: result.affectedRows });
      }
    });
   }
   });
   

   
   

   };



//////////////////////////////////////////////////////////////////////////////////////
/*const axios = require('axios');

const apiKey = '1a758f18c346bd26369bfbdaf9b9966e';
const cityName = 'Nablus'; // Replace with the desired city name

const apiUrl =`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

axios.get(apiUrl).then(response => {
    // Handle the response data here
    console.log(response.data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error fetching data:', error);
  });
*/


