var jsPsychTwoAtrributeBinaryChoice = (function (jspsych) {
  'use strict';

  const info = {
      name: "binary-two-states",
      parameters: {
          /**
           * The HTML string to be displayed.
           */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /**
           * Array containing the key(s) the subject is allowed to press to respond to the stimulus.
           */
          choices: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Choices",
              default: ['F', 'J'],
          },
          /**
           * Any content here will be displayed below the stimulus.
           */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /**
           * How long to show the stimulus.
           */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /**
           * How long to show trial before it ends.
           */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /**
           * If true, trial will end when subject makes a response.
           */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
           /**
           * If true, trial will be the practice trial and feedback will be shown;
           */
          prac_trial: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: "Practice trial",
            default: false,
        },
      },
  };

/**
 * trial method is responsible for running a single trial. 
 * parameters:
 * display_element: DOM element where jsPsych content is being generated --> HTML element
 * this parameter can change th content of the display: display_element.innerHTML = html_content;
 * trial: an object containing all the parameters specified in the correspnding TimelineNode. Need to call jsPsych.finishTrial() when it is done.
 */

class jsPsychTwoAtrributeBinaryChoice {
  constructor(jsPsych) {
      this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
  //  var selected_color = 'rgb(5, 157, 190)';
    //  var new_html =   `<div id="jspsych-html-keyboard-response-stimulus">stimulu</div>`;
   //   var new_html = '<div id="jspsych-html-keyboard-response-stimulus">' + 5+ "</div>";
   var selected_color = 'rgb(255, 0, 0)';
   var new_html = '';



   new_html += '<div id="left-div">';
   new_html += `<div id="upperleft-div" style="text-align: center;">${trial.stimulus[0]}</div>`;
   new_html += `<div id="lowerleft-div" style="text-align: center;">${trial.stimulus[1]}</div>`;
   new_html += '</div>';
    new_html += '<div id= "right-div">';
    new_html += `<div id="upperright-div"  text-align: center;>${trial.stimulus[2]}</div>`;
    new_html += `<div id="lowerright-div" text-align: center;>${trial.stimulus[3]}</div>`;
    new_html += '</div>';
    new_html += '<div id="binary-timeoutinfo"></div>';
    display_element.innerHTML = new_html;
 


    display_element.innerHTML = new_html;
      // add prompt
      if (trial.prompt !== null) {
          new_html += '<div id="prac_trial_prompt">'+ trial.prompt +'</div>'; ;
      }
      // draw
      display_element.innerHTML = new_html;
      // store response
      var response = {
          rt: null,
          key: null,
      };
      // function to end trial when it is time
      const end_trial = () => {
          // kill any remaining setTimeout handlers
          this.jsPsych.pluginAPI.clearAllTimeouts();
          // kill keyboard listeners
          if (typeof keyboardListener !== "undefined") {
              this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
          // gather the data to store for the trial
          var trial_data = {
              rt: response.rt,
              stimulus: trial.stimulus,
              response: response.key,
          };
          // clear the display
          display_element.innerHTML = "";
          // move on to the next trial
          this.jsPsych.finishTrial(trial_data);
      };


      var display_selection = function () {
          var selected;
          if ( response.key == 'f') {
            selected = '#left-div';
          } else {
            selected = '#right-div';
          }
          $(selected).css('border', `6px solid ${selected_color}`);
        };


    var after_response = (info) => {
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
    
         // only record the first response
         if (response.key == null) {
            response = info;
        }
        display_selection();
        setTimeout(() => end_trial(false), 1000);
    }
      
      // start the response listener
      if (trial.choices != "NO_KEYS") {
        if (trial.prac_trial) {
            if (trial.prompt == 'Try: accept the gamble') {
                var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: ['f'],
                    rt_method: "performance",
                    persist: false,
                    allow_held_key: false,
                });
            }
            if (trial.prompt == 'Try: accept the sure thing') {
                var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: ['j'],
                    rt_method: "performance",
                    persist: false,
                    allow_held_key: false,
                });
            }
            ;
        } else {
            var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.choices,
                rt_method: "performance",
                persist: false,
                allow_held_key: false,
            });
        }

      }
      // hide stimulus if stimulus_duration is set
      if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
              display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
          }, trial.stimulus_duration);
      }
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
      }
  }




}
jsPsychTwoAtrributeBinaryChoice.info = info;

return jsPsychTwoAtrributeBinaryChoice;

})(jsPsychModule);
