import express from "express";
import { fileToStt } from './utils/fileToStt.js';
import formidable from "formidable";
import bodyParser from "body-parser";
import cors from 'cors';
import fs from 'fs';
import stringComparison from 'string-comparison';
import Database from 'better-sqlite3';

const app = express();
app.use(bodyParser.text());
app.use(cors());
let db = new Database('../db-login/users.db');
db.pragma('journal_mode = WAL');
//let finder = null
app.post('/stt', async (req, res) => {
        let commands_string;
        let parameters_string = req.body
        let commands_arr = null;
        const dict = JSON.parse(parameters_string)
        const path = dict["file_path"]
        console.log(path);
        const apiKey = dict["api_key"]
        const sql = "SELECT file_commands FROM USER WHERE api_key = ?";
        try{
        const row = db.prepare(sql).get(apiKey)        
          if (row) {
            commands_string = row.file_commands
            commands_arr = commands_string.split("\r\n")
           // console.log(row.file_commands); // /r/n

          } else {
            console.log('No row found with the specified API key.');
            res.json("not ok")
            return;
          }
        }catch(err){
            console.error(err.message);
        }
          // Close the database connection
       // db.close();
        for (let i = 0 ; i < commands_arr.length; i++){
            console.log(commands_arr[i] + ", ");
        }
        const transcript = await fileToStt(path)
        const arr_algo_similarity = [stringComparison.cosine, stringComparison.lcs, stringComparison.mlcs]
        const bestCommand = findBestCommand(transcript, arr_algo_similarity[0], commands_arr);
        console.log('Best Command:', bestCommand);

        //const actions = finder.find(transcript)
        //debugger;
        //console.log(actions);
        //res.json({ src: transcript, act: actions })
        res.json(bestCommand)
    })
//})


app.listen(3001, () => console.log('Server started on port 3001'));



function findBestCommand(transcript, algorithm_similarity = stringComparison.levenshtein, commands_arr) {
  const ls = algorithm_similarity
  let maxSimilarity = 0; 
  let bestCommand = '';

  // Iterate over each command and find the best similarity
  for (let i = 0; i < commands_arr.length; i++) {
    const command = commands_arr[i].trim();
    
    // Calculate the Levenshtein distance between the command and transcript
    const similarity = ls.similarity  (command, transcript);
    console.log("the command is " + command + "transcript is " + transcript)
    console.log("the similarity is " + similarity)
    // Update the best similarity and command if necessary
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestCommand = command;
    }
  }
  
  let arr_transcript = transcript.split(" ")
  let cmd = arr_transcript[0]
  let max_match_sim = ls.similarity(cmd,bestCommand)
  let i;
  let index;
  for (i = 1 ; i<arr_transcript.length ; i++){
        cmd = cmd + " " + arr_transcript[i]
        let sim = ls.similarity(cmd, bestCommand)
        if (sim > max_match_sim){
            index = i
            max_match_sim = sim   
        }
  }
  if (max_match_sim < 0.7){
    return transcript;
  }
  let j;
  for(j=index+ 1; j < arr_transcript.length ; j++){
    bestCommand = bestCommand + " " + arr_transcript[j]
  }

  console.log(`command: ${bestCommand}%`);
  console.log(`similarity: ${bestCommand}%`);

  // Return the command with minimum distance
  return bestCommand;
}




