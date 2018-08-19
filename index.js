// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const moment = require('moment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  const ourBusinessHours = {
      Sunday: '8am-5pm',
      Monday: '8am-6pm',
      Tuesday: '8am-7pm',
      Wednesday: '8am-8pm',
      Thursday: '8am-9pm',
      Friday: '8am-10pm',
      Saturday: '8am-11pm'
  }
  
  function businessHoursHandler(agent) {
      let date = new Date(); //today
      if(agent.parameters.date !== null && agent.parameters.date !== undefined && agent.parameters.date.length > 0) {
          //given a date
          date = new Date(Date.parse(agent.parameters.date));
      }
      agent.add(`Our hours on ${getReadableDate(date)} are ${getBusinessHoursForDate(date)}`);
  }

  function getBusinessHoursForDate(date) {
      let dayOfWeek = moment(date).format("dddd");
      return ourBusinessHours[dayOfWeek];
  }
  
  function getReadableDate(date) {
      return moment(date).format("MMMM Do");
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('BusinessHours', businessHoursHandler);
  intentMap.set('BusinessHours - followup', businessHoursHandler);
  agent.handleRequest(intentMap);
});
