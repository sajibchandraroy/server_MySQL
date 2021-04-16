const express = require("express");
const bodyParser = require('body-parser')
const mysql = require("mysql");
// const cors = require("cors");


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());



const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "zoo_world",
});

// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

db.connect(function (error) {
    if(error){
        console.log("Connection Fail")
    }
    app.post("/createZoo", (req, res) => {      
      const name = req.body.name;
      const status = req.body.status; 
      db.query(    
        "INSERT INTO zoo(name, status) VALUES (?,?)",
        [name, status],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect(req.get('referer'));
          }
        }
      );
    });
});



app.post("/createLocation", (req, res) => {
    const name = req.body.name;     
    db.query(    
      "INSERT INTO location(name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(req.get('referer'));
        }
      }
    );
  });


app.post("/createAnimal", (req, res) => {  
    const name = req.body.name;
    const animal_type = req.body.animal_type;
    const birth_day = req.body.birth_day;
    const height = req.body.height;
    const weight = req.body.weight;
    const status = req.body.status; 
      
    db.query(      
      "INSERT INTO animal(name, animal_type, birth_day, height, weight, status) VALUES (?,?,?,?,?,?)",
      [name, animal_type, birth_day, height, weight, status ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(req.get('referer'));
        }
      }
    );
  });

  app.post("/animalAddToLocation", (req, res) => {    
    const animal_id = req.body.animal_id;
    const location_id = req.body.location_id;     
    db.query(    
      "INSERT INTO animal_location(animal_id, location_id) VALUES (?, ?)",
      [animal_id, location_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });

  app.post("/ticket", (req, res) => {
    const amount = req.body.amount;
    const zoo_id = req.body.zoo_id;     
    db.query(    
      "INSERT INTO ticket(amount, zoo_id) VALUES (?, ?)",
      [amount, zoo_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
            db.query("SELECT * FROM ticket WHERE id = ?", [result.insertId], (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send(result);
                }
              });        
        }
      }
    );
  });

  app.post("/user", (req, res) => {
    const name = req.body.name;
    const ticket_id = req.body.ticket_id;     
    db.query(    
      "INSERT INTO user(name, ticket_id) VALUES (?, ?)",
      [name, ticket_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });

  app.post("/locationVisit", (req, res) => {
    const user_id = req.body.user_id;
    const location_id = req.body.location_id;     
    db.query(    
      "INSERT INTO location_visit(user_id, location_id) VALUES (?, ?)",
      [user_id, location_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });

app.get("/zoo", (req, res) => {
  db.query("SELECT * FROM zoo", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/animal", (req, res) => {
    db.query("SELECT * FROM animal", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.get("/location", (req, res) => {
    db.query("SELECT * FROM location", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.get("/zoo/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM `zoo` WHERE id = ?",[id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    });
  });

app.put("/updateZoo/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.updatedZooName;
  const status = req.body.updatedZooStatus;
  db.query(    
    "UPDATE zoo SET name = ?, status = ? WHERE id = ?",
    [name, status, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/deleteZoo/:id", (req, res) => {
  const id = req.params.id;  
  db.query("DELETE FROM zoo WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server running in 5000 port");
});