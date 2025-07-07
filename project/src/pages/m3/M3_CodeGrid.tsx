import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/common/SectionWrapper';
import { QuizQuestions, WrapUp, MythBuster } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import VideoEmbed from '../../components/common/VideoEmbed';
import CodeTheGrid from '../../components/games/math/CodeTheGrid';
import PatternBreaker from '../../components/games/math/PatternBreaker';
import ObstacleMap from '../../components/games/math/ObstacleMap';
import SoundPlayer from '../../components/common/SoundPlayer';
import { playSoundEffect } from '../../components/common/SoundPlayer';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What do we call a step-by-step instruction?',
    options: [
      { text: 'Dance', explanation: 'A dance has steps, but it\'s not the term for step-by-step instructions in computing.' },
      { text: 'Plan', explanation: 'A plan can include steps, but it\'s not the specific term used in computing.' },
      { text: 'Algorithm', explanation: 'Correct! An algorithm is a step-by-step procedure for solving a problem or accomplishing a task.' },
      { text: 'Magic', explanation: 'While coding might seem magical, it follows logical steps, not magic.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which way is LEFT?',
    options: [
      { text: '🡺', explanation: 'This arrow points right, not left.' },
      { text: '🡸', explanation: 'Correct! This arrow points left.' },
      { text: '🡹', explanation: 'This arrow points up, not left.' },
      { text: '🡻', explanation: 'This arrow points down, not left.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What\'s the next pattern? 🔺🔺🔵🔺🔺🔵...',
    options: [
      { text: '🔵', explanation: 'Correct! The pattern is two triangles followed by a circle, repeating.' },
      { text: '🔺', explanation: 'If we follow the pattern of two triangles and one circle, the next shape would be a circle, not a triangle.' },
      { text: '⚫', explanation: 'The pattern uses blue circles, not black circles.' },
      { text: '❌', explanation: 'An X is not part of the established pattern.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What happens if one step in a code is wrong?',
    options: [
      { text: 'It still works', explanation: 'Code requires precise instructions. One wrong step can cause problems.' },
      { text: 'Nothing changes', explanation: 'A wrong step in code will affect the outcome.' },
      { text: 'It breaks', explanation: 'Correct! When code has an error, it often doesn\'t work as expected or breaks completely.' },
      { text: 'It goes faster', explanation: 'Errors in code don\'t make it run faster; they cause problems.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which direction is this arrow 🡺 pointing?',
    options: [
      { text: 'Right', explanation: 'Correct! This arrow points to the right.' },
      { text: 'Left', explanation: 'Left is the opposite direction.' },
      { text: 'Up', explanation: 'Up is a different direction.' },
      { text: 'Down', explanation: 'Down is a different direction.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is an algorithm?',
    options: [
      { text: 'A set of steps to solve a problem', explanation: 'Correct! An algorithm is a step-by-step solution.' },
      { text: 'A random guess', explanation: 'Algorithms are not random.' },
      { text: 'A magic trick', explanation: 'Algorithms are logical, not magic.' },
      { text: 'A type of food', explanation: 'Algorithm is not a food.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes after a left turn if you are facing north?',
    options: [
      { text: 'West', explanation: 'Correct! A left turn from north faces west.' },
      { text: 'East', explanation: 'East is a right turn from north.' },
      { text: 'South', explanation: 'South is a U-turn from north.' },
      { text: 'North', explanation: 'You started facing north.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which of these is a pattern?',
    options: [
      { text: 'Red, blue, red, blue', explanation: 'Correct! This is a repeating pattern.' },
      { text: 'Red, red, red, red', explanation: 'This is not a pattern, just repetition.' },
      { text: 'Blue, green, yellow', explanation: 'This is a sequence, not a repeating pattern.' },
      { text: 'Green, green, green', explanation: 'This is not a pattern.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What do you call a mistake in code?',
    options: [
      { text: 'A bug', explanation: 'Correct! A bug is a mistake in code.' },
      { text: 'A frog', explanation: 'A frog is not a coding term.' },
      { text: 'A code', explanation: 'Code is the instructions, not the mistake.' },
      { text: 'A jump', explanation: 'Jump is not a coding mistake.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which command moves you forward?',
    options: [
      { text: 'Go', explanation: 'Correct! "Go" or "Move forward" are commands to move ahead.' },
      { text: 'Stop', explanation: 'Stop means to halt.' },
      { text: 'Turn left', explanation: 'Turn left changes direction.' },
      { text: 'Turn right', explanation: 'Turn right changes direction.' },
    ],
    correct: 0,
    image: null,
  },
  // Adding 14 more questions to reach 24 total
  {
    question: 'What do you need to follow a pattern?',
    options: [
      { text: 'A rule', explanation: 'Correct! Patterns follow rules or sequences.' },
      { text: 'A computer', explanation: 'You don\'t need a computer to follow patterns.' },
      { text: 'A friend', explanation: 'You don\'t need a friend to follow patterns.' },
      { text: 'A book', explanation: 'You don\'t need a book to follow patterns.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If you face east and turn right, which way are you facing?',
    options: [
      { text: 'North', explanation: 'A right turn from east would face you south, not north.' },
      { text: 'East', explanation: 'You would no longer face east after turning.' },
      { text: 'South', explanation: 'Correct! A right turn from east faces you south.' },
      { text: 'West', explanation: 'A left turn from east would face you west, not a right turn.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which symbol means "repeat"?',
    options: [
      { text: '➡️', explanation: 'This arrow means go forward or next, not repeat.' },
      { text: '🔄', explanation: 'Correct! This circular arrow symbol often represents repeat.' },
      { text: '❌', explanation: 'This symbol usually means stop or cancel, not repeat.' },
      { text: '⭐', explanation: 'A star typically represents favorites or importance, not repetition.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a grid?',
    options: [
      { text: 'A circle', explanation: 'A grid is not a circle.' },
      { text: 'Lines crossing to form squares', explanation: 'Correct! A grid is made of horizontal and vertical lines forming squares.' },
      { text: 'A triangle', explanation: 'A grid is not a triangle.' },
      { text: 'A single straight line', explanation: 'A grid has multiple lines, not just one.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'How many steps does it take to move from one square to another on a grid?',
    options: [
      { text: '1 step', explanation: 'Correct! It takes one step to move from one square to an adjacent square.' },
      { text: '2 steps', explanation: 'It only takes one step to move to an adjacent square.' },
      { text: '3 steps', explanation: 'It only takes one step to move to an adjacent square.' },
      { text: '0 steps', explanation: 'You need at least one step to move to a different square.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is a loop in coding?',
    options: [
      { text: 'A type of knot', explanation: 'In coding, a loop is not a physical knot.' },
      { text: 'A mistake', explanation: 'A loop is not a mistake in coding.' },
      { text: 'A repeated set of instructions', explanation: 'Correct! A loop repeats a set of instructions until a condition is met.' },
      { text: 'A circle drawn on paper', explanation: 'In coding, a loop is not a physical circle.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is the next number? 2, 4, 6, 8, ...',
    options: [
      { text: '9', explanation: 'The pattern is counting by 2s, so after 8 would be 10, not 9.' },
      { text: '10', explanation: 'Correct! The pattern is counting by 2s: 2, 4, 6, 8, 10.' },
      { text: '12', explanation: 'After 8 in the sequence would be 10, not 12.' },
      { text: '16', explanation: 'After 8 in the sequence would be 10, not 16.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What shape comes next? 🔴 🟦 🔴 🟦 ...',
    options: [
      { text: '🔴', explanation: 'Correct! The pattern alternates between red circle and blue square.' },
      { text: '🟦', explanation: 'The last shape was a blue square, so the next would be a red circle.' },
      { text: '🟢', explanation: 'The pattern uses red circles, not green ones.' },
      { text: '🟨', explanation: 'The pattern uses blue squares, not yellow squares.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If you are at position (3,2) on a grid and move right 2 spaces, where are you?',
    options: [
      { text: '(5,2)', explanation: 'Correct! Moving right increases the first number by 2.' },
      { text: '(3,4)', explanation: 'Moving right changes the first number, not the second.' },
      { text: '(1,2)', explanation: 'Moving right increases the first number, not decreases it.' },
      { text: '(3,0)', explanation: 'Moving right changes the first number, not the second.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What does "debug" mean in coding?',
    options: [
      { text: 'Add more bugs', explanation: 'Debugging means removing bugs, not adding them.' },
      { text: 'Find and fix errors', explanation: 'Correct! Debugging means finding and fixing errors in code.' },
      { text: 'Add colors', explanation: 'Debugging is not about adding colors to code.' },
      { text: 'Make the code run faster', explanation: 'Debugging focuses on fixing errors, not necessarily making code faster.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a robot?',
    options: [
      { text: 'A human', explanation: 'Robots are machines, not humans.' },
      { text: 'A plant', explanation: 'Robots are machines, not plants.' },
      { text: 'A machine that follows instructions', explanation: 'Correct! Robots are machines that follow programmed instructions.' },
      { text: 'A type of animal', explanation: 'Robots are machines, not animals.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is a "condition" in coding?',
    options: [
      { text: 'A rule that decides what happens next', explanation: 'Correct! A condition checks if something is true or false to decide what to do next.' },
      { text: 'A type of robot', explanation: 'A condition is not a type of robot.' },
      { text: 'The weather', explanation: 'In coding, a condition is not about the weather.' },
      { text: 'A color', explanation: 'A condition is not a color in coding.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the next letter? A, C, E, G, ...',
    options: [
      { text: 'H', explanation: 'The pattern is skipping one letter each time, so after G would be I, not H.' },
      { text: 'I', explanation: 'Correct! The pattern is skipping one letter each time: A, C, E, G, I.' },
      { text: 'J', explanation: 'The pattern is skipping one letter each time, so after G would be I, not J.' },
      { text: 'K', explanation: 'The pattern is skipping one letter each time, so after G would be I, not K.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'If you face west and turn left twice, which way are you facing?',
    options: [
      { text: 'North', explanation: 'From west, one left turn faces south, and a second left turn faces east.' },
      { text: 'East', explanation: 'Correct! From west, one left turn faces south, and a second left turn faces east.' },
      { text: 'South', explanation: 'From west, one left turn faces south, but a second turn would face east.' },
      { text: 'West', explanation: 'After turning left twice, you would no longer be facing west.' },
    ],
    correct: 1,
    image: null,
  },
];

// Questions for the CodeTheGrid activity
const codeTheGridQuestions = [
  {
    question: 'What command moves the robot forward?',
    options: [
      { text: 'Move Forward', explanation: 'Correct! The "Move Forward" command makes the robot move one step in the direction it\'s facing.' },
      { text: 'Turn Left', explanation: 'The "Turn Left" command changes the robot\'s direction but doesn\'t move it forward.' },
      { text: 'Turn Right', explanation: 'The "Turn Right" command changes the robot\'s direction but doesn\'t move it forward.' },
      { text: 'Jump', explanation: 'There is no "Jump" command in our robot\'s instruction set.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If the robot is facing north and turns right, which direction will it face?',
    options: [
      { text: 'North', explanation: 'The robot would still be facing the same direction, which isn\'t correct after turning right.' },
      { text: 'East', explanation: 'Correct! When facing north, turning right makes the robot face east.' },
      { text: 'South', explanation: 'The robot would need to turn right twice from north to face south.' },
      { text: 'West', explanation: 'The robot would need to turn left from north to face west, not right.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'How many steps does it take to move from one square to the next on the grid?',
    options: [
      { text: '1 step', explanation: 'Correct! One "Move Forward" command moves the robot exactly one square in the direction it\'s facing.' },
      { text: '2 steps', explanation: 'The robot moves exactly one square with each forward command.' },
      { text: '3 steps', explanation: 'The robot moves exactly one square with each forward command.' },
      { text: '0 steps', explanation: 'The robot needs at least one step to move to a different square.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What happens if the robot tries to move off the grid?',
    options: [
      { text: 'It falls off', explanation: 'Our robot is programmed to stay on the grid and won\'t fall off.' },
      { text: 'It teleports to the other side', explanation: 'The robot doesn\'t teleport in our grid system.' },
      { text: 'It stays in place', explanation: 'Correct! The robot will stay in its current position if it tries to move off the grid.' },
      { text: 'It explodes', explanation: 'The robot doesn\'t explode when it reaches the edge of the grid.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is an algorithm in the context of our robot game?',
    options: [
      { text: 'A type of robot', explanation: 'An algorithm is not a type of robot.' },
      { text: 'A sequence of instructions', explanation: 'Correct! An algorithm is a sequence of instructions that tells the robot how to reach the goal.' },
      { text: 'The grid itself', explanation: 'The grid is the environment the robot moves in, not the algorithm.' },
      { text: 'The goal flag', explanation: 'The goal flag is the destination, not the algorithm.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'If the robot is facing east and turns left, which direction will it face?',
    options: [
      { text: 'North', explanation: 'Correct! When facing east, turning left makes the robot face north.' },
      { text: 'East', explanation: 'The robot would still be facing the same direction, which isn\'t correct after turning left.' },
      { text: 'South', explanation: 'When facing east, turning right (not left) would make the robot face south.' },
      { text: 'West', explanation: 'The robot would need to turn left twice from east to face west.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the most efficient way to make the robot turn around (face the opposite direction)?',
    options: [
      { text: 'Use the "Turn Around" command', explanation: 'There is no "Turn Around" command in our robot\'s instruction set.' },
      { text: 'Turn left once', explanation: 'Turning left once only changes the direction by 90 degrees, not 180 degrees.' },
      { text: 'Turn right once', explanation: 'Turning right once only changes the direction by 90 degrees, not 180 degrees.' },
      { text: 'Turn left twice or turn right twice', explanation: 'Correct! Either turning left twice or turning right twice will make the robot face the opposite direction.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'What does "debugging" mean in coding?',
    options: [
      { text: 'Finding and fixing errors', explanation: 'Correct! Debugging means identifying and correcting mistakes in your code.' },
      { text: 'Adding more bugs', explanation: 'Debugging is about removing bugs (errors), not adding them.' },
      { text: 'Making the robot move faster', explanation: 'Debugging is not about speed optimization.' },
      { text: 'Changing the color of the grid', explanation: 'Debugging is not about changing visual aspects like colors.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Why is it important to plan your robot\'s path before adding instructions?',
    options: [
      { text: 'To make the robot move faster', explanation: 'Planning doesn\'t affect the robot\'s speed.' },
      { text: 'To avoid wasting moves and create an efficient solution', explanation: 'Correct! Planning helps create the most efficient path to the goal.' },
      { text: 'To make the grid bigger', explanation: 'Planning doesn\'t change the size of the grid.' },
      { text: 'To change the robot\'s color', explanation: 'Planning doesn\'t affect the robot\'s appearance.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'If the robot is at position (2,3) and moves forward while facing north, what will its new position be?',
    options: [
      { text: '(2,2)', explanation: 'Correct! Moving north decreases the y-coordinate by 1.' },
      { text: '(2,4)', explanation: 'Moving north decreases the y-coordinate, not increases it.' },
      { text: '(3,3)', explanation: 'Moving north affects the y-coordinate, not the x-coordinate.' },
      { text: '(1,3)', explanation: 'Moving north affects the y-coordinate, not the x-coordinate.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the purpose of the flag in the grid?',
    options: [
      { text: 'To make the grid colorful', explanation: 'The flag has a specific purpose beyond decoration.' },
      { text: 'To mark the starting point', explanation: 'The robot icon marks the starting point, not the flag.' },
      { text: 'To mark the goal position', explanation: 'Correct! The flag shows where the robot needs to go.' },
      { text: 'To block the robot\'s path', explanation: 'The flag doesn\'t block the robot; it marks the destination.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'How many right turns equal one left turn?',
    options: [
      { text: '1 right turn', explanation: 'A right turn and a left turn move the robot in opposite directions.' },
      { text: '2 right turns', explanation: 'Two right turns would make the robot face the opposite direction, not equivalent to one left turn.' },
      { text: '3 right turns', explanation: 'Correct! Three right turns (270 degrees clockwise) is equivalent to one left turn (90 degrees counterclockwise).' },
      { text: '4 right turns', explanation: 'Four right turns would bring the robot back to its original orientation.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is the coordinate system used in the grid?',
    options: [
      { text: 'The top-left is (0,0)', explanation: 'Correct! The grid uses a coordinate system where the top-left corner is (0,0), x increases to the right, and y increases downward.' },
      { text: 'The bottom-left is (0,0)', explanation: 'In our grid, the origin (0,0) is at the top-left, not the bottom-left.' },
      { text: 'The center is (0,0)', explanation: 'The origin (0,0) is at the top-left of the grid, not the center.' },
      { text: 'There are no coordinates', explanation: 'The grid does use a coordinate system to track positions.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What happens when the robot reaches the goal?',
    options: [
      { text: 'Nothing happens', explanation: 'The game provides feedback when the robot reaches the goal.' },
      { text: 'The robot disappears', explanation: 'The robot doesn\'t disappear when reaching the goal.' },
      { text: 'Celebration with visual effects', explanation: 'Correct! When the robot reaches the goal, there\'s a celebration with visual effects like confetti.' },
      { text: 'The grid gets bigger', explanation: 'Reaching the goal doesn\'t change the size of the grid.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If the robot is facing south and turns left, which direction will it face?',
    options: [
      { text: 'North', explanation: 'The robot would need to turn left twice from south to face north.' },
      { text: 'East', explanation: 'Correct! When facing south, turning left makes the robot face east.' },
      { text: 'South', explanation: 'The robot would still be facing the same direction, which isn\'t correct after turning left.' },
      { text: 'West', explanation: 'When facing south, turning right (not left) would make the robot face west.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is the minimum number of instructions needed to move the robot from (0,0) to (2,0)?',
    options: [
      { text: '1 instruction', explanation: 'Moving from (0,0) to (2,0) requires moving 2 spaces to the right, which needs at least 2 instructions.' },
      { text: '2 instructions', explanation: 'Correct! You need 2 "Move Forward" commands if the robot is already facing right/east.' },
      { text: '3 instructions', explanation: 'If the robot is already facing east, you only need 2 forward movements.' },
      { text: '4 instructions', explanation: 'The minimum number of instructions needed is 2, not 4.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What does the robot\'s direction indicator show?',
    options: [
      { text: 'The robot\'s speed', explanation: 'The direction indicator shows orientation, not speed.' },
      { text: 'The way to the goal', explanation: 'The direction indicator shows which way the robot is facing, not necessarily the way to the goal.' },
      { text: 'Which way the robot is facing', explanation: 'Correct! The direction indicator shows which way the robot is currently facing.' },
      { text: 'The number of moves left', explanation: 'The direction indicator doesn\'t show the number of moves remaining.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Why do we use arrows to show the robot\'s direction?',
    options: [
      { text: 'Because arrows look cool', explanation: 'Arrows have a functional purpose beyond aesthetics.' },
      { text: 'To make the game colorful', explanation: 'The arrows serve a functional purpose, not just visual appeal.' },
      { text: 'To clearly indicate which way the robot is facing', explanation: 'Correct! Arrows provide a clear visual indication of the robot\'s current orientation.' },
      { text: 'To confuse players', explanation: 'Arrows are meant to help players, not confuse them.' },
    ],
    correct: 2,
    image: null,
  },
];

// Questions for the PatternBreaker activity
const patternBreakerQuestions = [
  {
    question: 'What is a pattern?',
    options: [
      { text: 'A random collection of shapes', explanation: 'Patterns have structure and are not random.' },
      { text: 'A sequence that follows a rule', explanation: 'Correct! A pattern is a sequence that follows a predictable rule.' },
      { text: 'A single shape repeated', explanation: 'A single shape repeated is one type of pattern, but patterns can be more complex.' },
      { text: 'A grid of squares', explanation: 'A grid is an arrangement, not necessarily a pattern.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔵, 🔴, 🔵, 🔴, ...?',
    options: [
      { text: '🔵', explanation: 'The pattern alternates between blue and red, so after red comes blue.' },
      { text: '🔴', explanation: 'The pattern is blue, red, blue, red, so the next should be blue, not red.' },
      { text: '🟢', explanation: 'The pattern uses only blue and red circles, not green.' },
      { text: '⚪', explanation: 'The pattern uses only blue and red circles, not white.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔺, 🔺, 🔵, 🔺, 🔺, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'After two triangles and a circle, the pattern repeats with two triangles, not another circle.' },
      { text: '🔺', explanation: 'Correct! The pattern is two triangles followed by a circle, repeating.' },
      { text: '⚪', explanation: 'The pattern uses blue circles, not white circles.' },
      { text: '🟢', explanation: 'The pattern uses blue circles, not green circles.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔴, 🔵, 🔵, 🔴, 🔵, 🔵, ...?',
    options: [
      { text: '🔴', explanation: 'Correct! The pattern is one red circle followed by two blue circles, repeating.' },
      { text: '🔵', explanation: 'The pattern is one red followed by two blue, so after two blue circles comes red.' },
      { text: '🟢', explanation: 'The pattern uses only red and blue circles, not green.' },
      { text: '🔺', explanation: 'The pattern uses only circles, not triangles.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🟡, 🔵, 🟡, 🔵, 🟡, 🔵, 🟡, ...?',
    options: [
      { text: '🟡', explanation: 'After yellow and blue alternating, the next would be blue, not yellow.' },
      { text: '🔵', explanation: 'Correct! The pattern alternates between yellow and blue circles.' },
      { text: '🔴', explanation: 'The pattern uses yellow and blue circles, not red.' },
      { text: '⚪', explanation: 'The pattern uses yellow and blue circles, not white.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔵, 🔵, 🔴, 🔵, 🔵, 🔵, 🔴, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'Correct! The pattern is two blue circles, one red circle, then three blue circles, one red circle, increasing the number of blue circles each time.' },
      { text: '🔴', explanation: 'The pattern increases the number of blue circles before each red circle.' },
      { text: '🟢', explanation: 'The pattern uses only blue and red circles, not green.' },
      { text: '🔺', explanation: 'The pattern uses only circles, not triangles.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: ⚪, 🔵, 🔵, ⚪, 🔵, 🔵, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'The pattern shows an increasing number of blue circles after each white circle.' },
      { text: '⚪', explanation: 'Correct! The pattern is one white circle followed by an increasing number of blue circles.' },
      { text: '🔴', explanation: 'The pattern uses white and blue circles, not red.' },
      { text: '🟢', explanation: 'The pattern uses white and blue circles, not green.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔴, 🟡, 🟢, 🔴, 🟡, 🟢, 🔴, ...?',
    options: [
      { text: '🔴', explanation: 'The pattern is red, yellow, green repeating, so after red would be yellow.' },
      { text: '🟡', explanation: 'Correct! The pattern is red, yellow, green, repeating.' },
      { text: '🟢', explanation: 'The pattern is red, yellow, green repeating, so after red would be yellow, not green.' },
      { text: '🔵', explanation: 'The pattern uses red, yellow, and green circles, not blue.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔵, 🔵, 🔴, 🔵, 🔵, 🔴, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'Correct! The pattern is two blue circles, one red circle, repeating.' },
      { text: '🔴', explanation: 'The pattern is two blue circles, then one red circle.' },
      { text: '🟢', explanation: 'The pattern uses only blue and red circles, not green.' },
      { text: '⚪', explanation: 'The pattern uses only blue and red circles, not white.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🟢, 🟢, 🟢, 🔴, 🟢, 🟢, 🟢, 🔴, ...?',
    options: [
      { text: '🟢', explanation: 'Correct! The pattern is three green circles, one red circle, repeating.' },
      { text: '🔴', explanation: 'The pattern is three green circles, then one red circle.' },
      { text: '🔵', explanation: 'The pattern uses only green and red circles, not blue.' },
      { text: '🔺', explanation: 'The pattern uses only circles, not triangles.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔺, 🔵, 🔺, 🔵, 🔺, 🔵, 🔺, 🔵, 🔺, ...?',
    options: [
      { text: '🔵', explanation: 'Correct! The pattern alternates between triangle and blue circle.' },
      { text: '🔺', explanation: 'The pattern alternates between triangle and blue circle, so after a triangle comes a circle.' },
      { text: '🔴', explanation: 'The pattern uses triangles and blue circles, not red circles.' },
      { text: '⚪', explanation: 'The pattern uses triangles and blue circles, not white circles.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🟣, 🟡, 🟣, 🟡, 🟣, 🟡, 🟣, ...?',
    options: [
      { text: '🟣', explanation: 'The pattern alternates between purple and yellow, so after purple comes yellow.' },
      { text: '🟡', explanation: 'Correct! The pattern alternates between purple and yellow circles.' },
      { text: '🔴', explanation: 'The pattern uses purple and yellow circles, not red.' },
      { text: '🔵', explanation: 'The pattern uses purple and yellow circles, not blue.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔵, 🔴, 🔵, 🔴, 🔵, 🔴, 🔵, 🔴, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'The pattern alternates between blue and red, so after blue comes red.' },
      { text: '🔴', explanation: 'Correct! The pattern alternates between blue and red, always blue first.' },
      { text: '🟢', explanation: 'The pattern uses only blue and red circles, not green.' },
      { text: '⚪', explanation: 'The pattern uses only blue and red circles, not white.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔺, 🔺, 🟢, 🔺, 🔺, 🟢, 🔺, 🔺, ...?',
    options: [
      { text: '🔺', explanation: 'The pattern is two triangles, one green circle, repeating, so after two triangles comes a green circle.' },
      { text: '🟢', explanation: 'Correct! The pattern is two triangles, one green circle, repeating.' },
      { text: '🔴', explanation: 'The pattern uses triangles and green circles, not red circles.' },
      { text: '⚪', explanation: 'The pattern uses triangles and green circles, not white circles.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🟡, 🟡, 🔴, 🟡, 🟡, 🔴, 🟡, ...?',
    options: [
      { text: '🟡', explanation: 'Correct! The pattern is two yellow circles, one red circle, repeating.' },
      { text: '🔴', explanation: 'The pattern is two yellow circles, then one red circle.' },
      { text: '🔵', explanation: 'The pattern uses only yellow and red circles, not blue.' },
      { text: '🟢', explanation: 'The pattern uses only yellow and red circles, not green.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 🔵, 🟢, 🔵, 🟢, 🔵, 🟢, 🔵, ...?',
    options: [
      { text: '🔵', explanation: 'The pattern alternates between blue and green, so after blue comes green.' },
      { text: '🟢', explanation: 'Correct! The pattern alternates between blue and green circles.' },
      { text: '🔴', explanation: 'The pattern uses only blue and green circles, not red.' },
      { text: '🟡', explanation: 'The pattern uses only blue and green circles, not yellow.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 1, 3, 5, 7, ...?',
    options: [
      { text: '8', explanation: 'The pattern is odd numbers increasing by 2, so after 7 would be 9, not 8.' },
      { text: '9', explanation: 'Correct! The pattern is odd numbers increasing by 2: 1, 3, 5, 7, 9.' },
      { text: '10', explanation: 'The pattern is odd numbers increasing by 2, so after 7 would be 9, not 10.' },
      { text: '11', explanation: 'The pattern is odd numbers increasing by 2, so after 7 would be 9, not 11.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 2, 4, 6, 8, ...?',
    options: [
      { text: '9', explanation: 'The pattern is even numbers increasing by 2, so after 8 would be 10, not 9.' },
      { text: '10', explanation: 'Correct! The pattern is even numbers increasing by 2: 2, 4, 6, 8, 10.' },
      { text: '11', explanation: 'The pattern is even numbers increasing by 2, so after 8 would be 10, not 11.' },
      { text: '12', explanation: 'The pattern is even numbers increasing by 2, so after 8 would be 10, not 12.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 2, 4, 8, 16, ...?',
    options: [
      { text: '18', explanation: 'The pattern is doubling each number, so after 16 would be 32, not 18.' },
      { text: '24', explanation: 'The pattern is doubling each number, so after 16 would be 32, not 24.' },
      { text: '32', explanation: 'Correct! The pattern is doubling each number: 2, 4, 8, 16, 32.' },
      { text: '64', explanation: 'The next number after 16 would be 32, not 64 (which would be the number after 32).' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 1, 4, 9, 16, ...?',
    options: [
      { text: '20', explanation: 'The pattern is square numbers, so after 16 (4²) would be 25 (5²), not 20.' },
      { text: '25', explanation: 'Correct! The pattern is square numbers: 1 (1²), 4 (2²), 9 (3²), 16 (4²), 25 (5²).' },
      { text: '32', explanation: 'The pattern is square numbers, so after 16 (4²) would be 25 (5²), not 32.' },
      { text: '36', explanation: 'The pattern is square numbers, so after 16 (4²) would be 25 (5²), not 36 (which is 6²).' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: A, C, E, G, ...?',
    options: [
      { text: 'H', explanation: 'The pattern is skipping one letter each time, so after G would be I, not H.' },
      { text: 'I', explanation: 'Correct! The pattern is skipping one letter each time: A, C, E, G, I.' },
      { text: 'J', explanation: 'The pattern is skipping one letter each time, so after G would be I, not J.' },
      { text: 'K', explanation: 'The pattern is skipping one letter each time, so after G would be I, not K.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 1, 1, 2, 3, 5, ...?',
    options: [
      { text: '6', explanation: 'The pattern is the Fibonacci sequence where each number is the sum of the two before it, so after 5 would be 8, not 6.' },
      { text: '7', explanation: 'The pattern is the Fibonacci sequence where each number is the sum of the two before it, so after 5 would be 8, not 7.' },
      { text: '8', explanation: 'Correct! The pattern is the Fibonacci sequence where each number is the sum of the two before it: 1, 1, 2, 3, 5, 8.' },
      { text: '9', explanation: 'The pattern is the Fibonacci sequence where each number is the sum of the two before it, so after 5 would be 8, not 9.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 3, 6, 9, 12, ...?',
    options: [
      { text: '13', explanation: 'The pattern is counting by 3s, so after 12 would be 15, not 13.' },
      { text: '14', explanation: 'The pattern is counting by 3s, so after 12 would be 15, not 14.' },
      { text: '15', explanation: 'Correct! The pattern is counting by 3s: 3, 6, 9, 12, 15.' },
      { text: '18', explanation: 'The next number after 12 would be 15, not 18 (which would be the number after 15).' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What comes next in this pattern: 10, 20, 30, 40, ...?',
    options: [
      { text: '45', explanation: 'The pattern is counting by 10s, so after 40 would be 50, not 45.' },
      { text: '50', explanation: 'Correct! The pattern is counting by 10s: 10, 20, 30, 40, 50.' },
      { text: '55', explanation: 'The pattern is counting by 10s, so after 40 would be 50, not 55.' },
      { text: '60', explanation: 'The next number after 40 would be 50, not 60 (which would be the number after 50).' },
    ],
    correct: 1,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'Introduction to Grids',
    url: 'https://www.youtube.com/embed/VCT2X_6bTDQ'
  },
  {
    title: 'Human Coding Grid',
    url: 'https://www.youtube.com/embed/IfHmHZPxuV8'
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'Introducing Kids to Coding',
    url: 'https://www.youtube.com/embed/nwMeINjRl6Y'
  }
];

// Section labels
const sections = [
  'Warm-Up',
  'Introduction',
  'Myth to Bust',
  'Activities',
  'Wrap-Up',
];

const sectionToStage: Record<string, 'warmup' | 'intro' | 'activity' | 'exit'> = {
  'Warm-Up': 'warmup',
  'Introduction': 'intro',
  'Myth to Bust': 'activity',
  'Activities': 'activity',
  'Wrap-Up': 'activity',
  'Exit': 'exit',
};

const sectionLabels = sections;
const TOTAL_QUESTIONS = warmupQuestions.length;
const TOTAL_ACTIVITIES = 3;

const M3_CodeGrid: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
  const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activityTab, setActivityTab] = useState(0);
  const [mythRevealed, setMythRevealed] = useState(false);

  const nextSection = () => {
    setSection((s) => Math.min(s + 1, sections.length - 1));
    setWarmupIndex(0);
    setWarmupAnswered(false);
    setWarmupCorrect(false);
  };
  
  const prevSection = () => setSection((s) => Math.max(s - 1, 0));

  // Custom MCQ for warmup
  const warmupQ = warmupQuestions[warmupIndex];
  const handleWarmupAnswer = (idx: number) => {
    if (warmupAnswered || showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    setWarmupAnswered(true);
    if (idx === warmupQ.correct) {
      setWarmupCorrect(true);
    } else {
      setWarmupCorrect(false);
    }
  };

  // Add a handler for dismissing the explanation
  const handleDismissExplanation = () => {
    setShowExplanation(false);
    setWarmupAnswered(false);
    setSelectedOption(null);
    if (warmupCorrect) {
      setQuestionsCompleted((prev) => prev + 1);
      setTimeout(() => {
        if (warmupIndex === warmupQuestions.length - 1) {
          nextSection();
        } else {
          setWarmupIndex(warmupIndex + 1);
          setWarmupCorrect(false);
        }
      }, 300);
    }
  };

  // Handle myth reveal
  const handleMythReveal = () => {
    setMythRevealed(true);
    // Play sound effect
    try {
      new Audio('/audio/myth_bust.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  // Activity tabs
  const activityTabs = [
    {
      label: 'Code the Grid',
      content: (
        <SectionWrapper key="codethegrid" label="Code the Grid" icon="🧩">
          <CodeTheGrid />
        </SectionWrapper>
      )
    },
    {
      label: 'Pattern Breaker',
      content: (
        <SectionWrapper key="patternbreaker" label="Pattern Breaker" icon="🔍">
          <PatternBreaker />
        </SectionWrapper>
      )
    },
    {
      label: 'Obstacle Map',
      content: (
        <SectionWrapper key="obstaclemap" label="Obstacle Map" icon="🗺️">
          <ObstacleMap />
        </SectionWrapper>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-2 sm:px-6">
        <ProgressBarSection sectionLabels={sectionLabels} currentSection={section} />
        {/* Only show the quiz progress bar in the Warm-Up section */}
        {sectionLabels[section] === 'Warm-Up' && (
          <ProgressBarMain current={questionsCompleted} total={TOTAL_QUESTIONS} color="bg-indigo-500" label="questions complete" />
        )}
        {/* Show activities progress bar only in Activities section */}
        {sectionLabels[section] === 'Activities' && (
          <ProgressBarMain current={activityTab + 1} total={TOTAL_ACTIVITIES} color="bg-blue-400" label="activities" />
        )}
        <AnimatePresence mode="wait">
          {section === 0 && (
            <SectionWrapper key="warmup" label="Warm-Up Quiz" icon="🔥">
              <QuizQuestions questions={warmupQuestions} onComplete={nextSection} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold mb-6 text-center">Code Grid: Pattern Breaker</div>
                
                {/* Story scene */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6 w-full">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">A robot is lost in a grid...</div>
                      <div className="text-gray-600">
                        "Beep boop! I need help to find my way!"
                      </div>
                    </div>
                    <div className="text-5xl">🤖</div>
                    <div className="bg-green-100 rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">Can you guide the robot?</div>
                      <div className="text-green-700 font-medium">
                        "Give the robot the right steps to reach the goal!"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instruction demonstration */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6 w-full">
                  <div className="text-center text-xl mb-4 font-bold">Robot Commands</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡺</div>
                      <div className="font-medium">Turn Right</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡸</div>
                      <div className="font-medium">Turn Left</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡹</div>
                      <div className="font-medium">Move Forward</div>
                    </div>
                  </div>
                </div>

                {/* Video placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {introVideos.map((video, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                      <VideoEmbed 
                        title={video.title}
                        url={video.url}
                      />
                      <div className="text-sm font-medium mt-2">{video.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Coding is only for computers!"
                truth="Coding is just giving clear instructions – like telling someone how to make a sandwich! You don't need a computer to code – just a clear idea!"
                videos={mythVideos}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <ActivityTabs tabs={activityTabs} activeTab={activityTab} onTabChange={setActivityTab} />
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
              <WrapUp
                title="Code Grid Master"
                summary="You've learned how algorithms are step-by-step instructions that help us solve problems!"
                keyPoints={[
                  "Coding is about giving clear step-by-step instructions",
                  "Algorithms help us solve problems in a logical way",
                  "Patterns can help us predict what comes next",
                  "Even simple commands can create complex movements"
                ]}
                questions={[
                  "What is an algorithm you use in your real life?",
                  "Why does a robot need clear steps?",
                  "How could you use coding ideas in other subjects?"
                ]}
                nextLessonText="Next up: Pizza Fractions!"
              />
            </SectionWrapper>
          )}
        </AnimatePresence>
        <div className="flex gap-4 mt-8">
          {section > 0 && (
            <button className="px-4 py-2 bg-gray-200 rounded font-bold" onClick={prevSection}>Back</button>
          )}
          {section < sections.length - 1 && (
            <button className="px-4 py-2 bg-indigo-500 text-white rounded font-bold" onClick={nextSection}>Next</button>
          )}
        </div>
      </div>
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <button
            className="absolute top-6 right-8 text-white text-4xl font-bold hover:text-red-400 focus:outline-none"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close fullscreen image"
          >
            ×
          </button>
          <img src={fullscreenImage} alt="Enlarged" className="w-[90vw] h-[90vh] max-w-[98vw] max-h-[98vh] object-contain rounded shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default M3_CodeGrid; 