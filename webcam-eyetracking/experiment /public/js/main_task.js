
//initial calibration
//validation shows the the dots
//decision trials - try ROI = 2,3,4,5,6

var jsPsych = initJsPsych({
    extensions: [
      {type: jsPsychExtensionWebgazer}
    ]
  });

var present_pairs = [['img/FoodImages/foodStimulus_0.jpg', 'img/FoodImages/foodStimulus_1.jpg'],
  ['img/charityImages/charitySlide_0.jpg', 'img/charityImages/charitySlide_1.jpg']];

var multi_attribute_present_pairs = [['50 days','$100', 'Now','$10'],
['50%','$100','80%','$10']];

var gamble_three_states= [[100,40,120],
[30,100,50]];


var complex_decision = [
  {
    "Sentence": "Empty legislative seats will be filled _______",
      "Options":  ['next session','immediately'],
  },
  {
    "Sentence": " Intentionally harming another person is _____permissible.",
      "Options":  ['Sometimes','Never'],
  },

]

var preload = {
  type: jsPsychPreload,
  images: ['img/instruct0.png','img/instruct1.png',
        'img/instruct3.png','img/FoodImages/foodStimulus_0.jpg', 'img/FoodImages/foodStimulus_1.jpg',
        'img/charityImages/charitySlide_0.jpg', 'img/charityImages/charitySlide_1.jpg']
}
var subject_id  =  this.jsPsych.randomization.randomID(7);




var start_exp_survey_trial = {
    type: jsPsychSurveyText,
    questions: [
      {prompt: "What's your worker ID?", rows: 2, columns:50 , required:true}, 
    ],
    preamble: `<div>Please answer the following questions to begin today's session. </div>`,
};


var Chinresttrial = {
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "cm",
  pixels_per_unit: 50
};

function makeSurveyCode(success) {
  var prefix;
  if (success == "success") {
    prefix = 'cg'
  }
  else {
    prefix = 'sb'
  }
  return `${prefix}_${subject_id}`;
}


var final_code = makeSurveyCode('success');


/** full screen */
var fullscreenEnter = {
  type: jsPsychFullscreen,
  message: `<div> The study will switch to full screen mode when you press the button below.  <br/>
  Your webcam will be turned on during the study.<br/>
  If you do not wish to allow the use of your camera,  close the study page now. <br/>
  <br><br/>
  Once the study has started, <b>DO NOT EXIT</b> full screen mode. <br/> 
  <br><br/>
      When you are ready to begin, press the button.</div>`,
  fullscreen_mode: true,
  on_finish: function () {
    document.body.style.cursor = 'none'
  }
};

var fullscreenEnd = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var WelcomeInstruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div> <font size=120%; font color = 'green';>Welcome! </font><br/>
                                             <br><br/>
                Today, you will make a series of choices. Press F to choose the left option and J to choose the right option. <br/>
                Your eye movements will be tracked during the study. So, please do your best to sit still and avoid moving your head.<br/>
                <br><br/>
                <br><br/>
                When you are ready, press the <b>SPACE BAR</b>.  </div>`,
  post_trial_gap: 500,
  choices: [' '],

}


/*****************************
***********Eye tracking ***********
*****************************/



var cali_points = [[20,20],[20,80],[80,20], [50,50],[20,50],[50,20],[80,80],[80,50],[50,80]];
var point_size = 50;
var threshold = 0.7;
var recalibrate_criterion = 0.2;
var calibration_mode = 'view';

var eyeTrackingInstruction1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div> <font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                             <br><br/>
                Before we begin with the study, we need to turn on and adjust your webcam for eye-tracking.   <br/>
                
                There are two parts to this process. The first part is calibration and the second part is validation.<br/>
                <br><br/>
                During calibration, you will see a series of dots like this <span id="calibration_dot_instruction"></span> appear on the screen, each for 2 seconds. <br/>
                Your task is simply to stare directly at each dot until it disappears.<br/>
                Then, quickly move your eyes to the next dot and repeat.<br/>
                <br><br/>
                Validation is basically the same as calibration. You simply need to stare at each dot until it disappears.<br/>
                <br><br/>
                When you are ready, press the <b>SPACE BAR</b> to continue. </div>`,
  post_trial_gap: 500,
  choices: [' '],

}

var eyeTrackingNote = {

  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 5px font color = "darkred">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="img/instruct1.png"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/>
            </div>
             <br><br/>
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACE BAR</b> to continue </font></div>`,
  post_trial_gap: 500,
  choices: [' '],

}


var calibrationInstruction= {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div>        It may take up to 30 seconds for the camera to initialize. <br/>
                <br><br/>
                When you are ready, press the <b>SPACE BAR</b> to bring up the video feed.  </div>`,
  post_trial_gap: 500,
  choices: [' '],
  on_finish: () => document.body.style.cursor = 'pointer',

}



var init_camera = {
  type: jsPsychWebgazerInitCamera,
  on_finish: function() {
      if (calibration_mode == 'view') {
          document.body.style.cursor = 'none';
      }
  }
};
  var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: cali_points,
    calibration_mode: calibration_mode,
    point_size: point_size,
     time_per_point: 2000,
     repetitions_per_point: 1,
    randomize_calibration_order: true,
    test_mode:true,
  }

  var validationInstruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:`<div>  Now we'll measure the accuracy of the calibration. <br/>
    <br><br/>
    When you are ready, press the <b>SPACE BAR</b> to begin the validation. </div>`,
    choices: [' '],
    post_trial_gap: 1000,
    on_finish: ()=>  document.body.style.cursor = 'none',
  }
  

  var validation = {
    type: jsPsychWebgazerValidate,
    validation_points: cali_points, 
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    point_size: point_size,
    show_validation_data: false,
    dot_threshold: threshold,
    data: {
      task: 'validate'
    }
  }


var recalibrateInstruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <p>The accuracy of the calibration is a little lower than we'd like.</p>
      <p>Let's try calibrating one more time.</p>
      <br></br>
      <p>When you are ready, press the <b>SPACE BAR</b> to recalibrate.  </p>
    `,
    choices: [' '],
  }



  var recalibrate = {
    timeline: [recalibrateInstruction, calibration, validationInstruction, validation],
    conditional_function: function(){
      var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
      var below_threshold_count = validation_data.percent_in_roi.filter(function(x) {
        var minimum_percent_acceptable = threshold;
        return x < minimum_percent_acceptable}).length;
        console.log(below_threshold_count);
        console.log(cali_points.length);
        return below_threshold_count/cali_points.length >= recalibrate_criterion;

      // return validation_data.percent_in_roi.some(function(x){
      //   var minimum_percent_acceptable = threshold;
      //   return x < minimum_percent_acceptable;
      // });
    },
    data: {
      phase: 'recalibration'
    }
  }


/*****************************
***********Experiment***********
*****************************/
var studyBeginInstruction1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div> <font size=120%; font color = 'green';> Study Overview </font><br/>
                                             <br><br/>
                In this study, you will make a series of decisions. <br/>
                Press F to choose the left option and Press J to choose the right option. <br/>
                When you are ready, press the <b>SPACE BAR</b>.  </div>`,
  post_trial_gap: 500,
  choices: [' '],

}


var between_trials = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<span id="calibration_dot_instruction"></span>' ,
  choices: "NO_KEYS",
  trial_duration: 500,
  extensions: [
    {
      type: jsPsychExtensionWebgazer, 
      params: {targets: ['#calibration_dot_instruction' ]}
    }
  ]
}


var nBinaryTrialsCount = 0;
var nTwoAttributeBinaryTrialsCount = 0;
var gambleTrialCount = 0;
var nBinaryTrialsTextCount = 0;

var img_binary_trials = {

  timeline:[between_trials,
      {

          type: jsPsychBinaryChoiceImg,
          stimulus: () => present_pairs[nBinaryTrialsCount],
          prac_trial: false,
          extensions: [
            {
              type: jsPsychExtensionWebgazer, 
              params: {targets: ['#left_state','#right_state']}
            }
          ],
          on_finish: function(data) {
            nBinaryTrialsCount++
          },
      }
  ],
  loop_function: () => nBinaryTrialsCount < 2,
};

var text_binary_trials = {
  between_trials,
 timeline: [ 
   {
    type: jsPsychHtmlKeyboardResponse,
     stimulus: () => complex_decision[nBinaryTrialsTextCount].Sentence,
     choices: [' '],
     instruction: false,
     extensions: [
      {
        type: jsPsychExtensionWebgazer, 
        params: {targets: ['#jspsych-html-keyboard-response-stimulus']}
      }
    ],
     post_trial_gap: 500,
   },
   between_trials,
   {
    type: jsPsychBinaryChoiceText,
     stimulus: () =>   complex_decision[nBinaryTrialsTextCount].Options,
     extensions: [
      {
        type: jsPsychExtensionWebgazer, 
        params: {targets: ['#left_state_text','#right_state_text']}
      }
    ],
     on_finish: () => nBinaryTrialsTextCount++,
   }
 ],
 loop_function: () => nBinaryTrialsTextCount < 2,

};


var multi_attribute_trials = {

  timeline:[between_trials,
      {

          type: jsPsychTwoAtrributeBinaryChoice,
          stimulus: () => multi_attribute_present_pairs[nTwoAttributeBinaryTrialsCount],
          prac_trial: false,
          extensions: [
            {
              type: jsPsychExtensionWebgazer, 
              params: {targets: ['#upperleft-div','#upperright-div','#lowerleft-div','#lowerright-div', ]}
            }
          ],
          on_finish: function(data) {
            nTwoAttributeBinaryTrialsCount++
          },
      }
  ],
  loop_function: () => nTwoAttributeBinaryTrialsCount < 2,
};




var gamble_trials = {

  timeline:[between_trials,
      {

          type: jsPsychBinaryChoiceMultipleStates,
          stimulus: () => gamble_three_states[gambleTrialCount],
          prac_trial: false,
          extensions: [
            {
              type: jsPsychExtensionWebgazer, 
              params: {targets: ['#upper_state',
                                  '#lower_left_state', '#lower_right_state']}
            }
          ],
          on_finish: function(data) {
            gambleTrialCount++
          },
      }
  ],
  loop_function: () => gambleTrialCount < 2,
};




var end_exp = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div>
  Congratulations! You have completed the study. </br>
  </br></br>
  Press the <b>SPACE BAR</b> to end the experiment.</br>
  </div>`,
}

//  // link to the backend
  var show_data = {
    type: jsPsychHtmlKeyboardResponse,
    on_start: () =>  jsPsych.data.get().localSave('json','mydata.json'),
     stimulus: function() {
       var trial_data = jsPsych.data.getLastTrialData().values();
      var trial_json = JSON.stringify(trial_data, null, 2);
       return `<p style="margin-bottom:0px;"><strong>Trial data:</strong></p>
         <pre style="margin-top:0px;text-align:left;">${trial_json}</pre>`;
    },
    choices: "NO_KEYS",
   
   };

   

  function startExperiment() {
    jsPsych.run([
       preload,
      start_exp_survey_trial,fullscreenEnter,
      //Chinresttrial,
      eyeTrackingInstruction1, eyeTrackingNote, calibrationInstruction,init_camera,calibration,validationInstruction, validation,recalibrate,
       studyBeginInstruction1, img_binary_trials, text_binary_trials, gamble_trials, multi_attribute_trials,
        end_exp, fullscreenEnd,show_data
      ]);
  
  };
    
  