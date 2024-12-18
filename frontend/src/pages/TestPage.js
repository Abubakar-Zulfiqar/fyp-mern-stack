import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const categories = {
  anxiety_level: [
    "I feel tense or 'wound up':",
    "I get a sort of frightened feeling as if something awful is about to happen:",
    "Worrying thoughts go through my mind:",
    "I can sit at ease and feel relaxed:",
    "I get sudden feelings of panic:",
  ],
  depression: [
    "I still enjoy the things I used to enjoy:",
    "I can laugh and see the funny side of things:",
    "I have lost interest in my appearance:",
    "I look forward with enjoyment to things:",
    "I can enjoy a good book or radio or TV program:",
  ],
  self_esteem: [
    "On the whole, I am satisfied with myself:",
    "At times I think I am no good at all:",
    "I feel that I have a number of good qualities:",
    "I am able to do things as well as most other people:",
    "I take a positive attitude toward myself:",
  ],
  bullying: ["How often are you bullied last year?"],
  headache: ["How many times do you have headaches in a week?"],
  basic_needs: [
    "How does social and economic status affect the fulfillment of basic psychological needs and mental health?",
  ],
  safety: [
    "How do social and economic factors shape an individual's sense of safety and affect their mental health?",
  ],
  future_career_concerns: [
    "Promotion:",
    "Control over how and when I Work:",
    "Being able to get a job done well enough through managing the efforts of others:",
    "Enough leisure time to travel, relax and be myself:",
    "Being able to contribute new ideas which will help build the future:",
    "A balance between work and other areas of life:",
    "Leading a team on key organizational project:",
    "Opening up new business directions through initiating new ideas:",
    "Being part of organization:",
    "Being given challenges which stretch me intellectually:",
    "Being able to show that I have more to offer than my colleagues:",
    "Being able to identify closely with an organization:",
    "To be recognized for my expertise:",
    "Being able to get the most out of people in order to achieve the set goal:",
    "Taking the risk of getting a new business venture off the ground:",
    "Being able to put work in its place as an important, but not the only part of my life:",
    "To have the status that comes with being part of a successful company:",
    "To be involved in assignments which will take the organisation forward:",
    "To be able to see that I am doing better than those I am in competition with:",
    "Knowing that I am respected for the specialist skills that I bring:",
    "Being able to work when and where I want so long as I can deliver results:",
    "Knowing every year that I have further developed my expertise:",
    "Being able to make decisions without being controlled by organisational bureaucracy:",
    "The excitement of creating something new whose success depends on me:",
  ],
  sleep_quality: [
    "I have difficulty falling asleep:",
    "I fall into a deep sleep:",
    "I wake up while sleeping:",
    "I have difficulty getting back to sleep once I wake up in middle of the night:",
    "I wake up easily because of noise",
    "I toss and turn:",
    "I never go back to sleep after awakening during sleep:",
    "I feel refreshed after sleep:",
    "I feel unlikely to sleep after sleep:",
    "Poor sleep gives me headaches:",
    "Poor sleep makes me irritated:",
    "I would like to sleep more after waking up:",
    "My sleep hours are enough:",
    "Poor sleep makes me lose my appetite:",
    "Poor sleep makes hard for me to think:",
    "Poor sleep makes my life painful:",
    "I feel vigorous after sleep:",
    "My fatigue is relieved after sleep:",
    "Poor sleep cause me to make mistake at work:",
    "I am satisfied with my sleep:",
    "Poor sleep makes me forgot things more easily:",
    "Poor sleep makes it hard to concentrate at work:",
    "Poor sleep makes me lose interest in work or others:",
    "Sleepiness interferes with my daily life:",
    "Poor sleep makes me lose desire in all things:",
    "I have difficulty getting out of bed:",
    "Poor sleep makes me easily tired at work:",
    "I have a clear head after sleep:",
  ],
  academic_performance: [
    "I made myself ready in all my subjects:",
    "I pay attention and listen during every discussion:",
    "I want to get good grades in every subject:",
    "I actively participate in every discussion:",
    "I start papers and projects as soon as they are assigned:",
    "I enjoy homework and activities because they help me improve my skills in every subject:",
    "I exert more effort when I do difficult assignments:",
    "Solving problems is a useful hobby for me:",
  ],
};

const options = [
  { label: "NA", value: 0 },
  { label: "SD", value: 1 },
  { label: "D", value: 2 },
  { label: "N", value: 3 },
  { label: "A", value: 4 },
  { label: "SA", value: 5 },
];

// Categories that require showing only 1/4 of the questions
const quarterCategories = [
  "future_career_concerns",
  "sleep_quality",
  "academic_performance",
];

// Helper function to get a quarter of shuffled questions
function getQuarterOfQuestions(arr) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  const quarterLength = Math.ceil(shuffled.length / 4);
  return shuffled.slice(0, quarterLength);
}

const TestPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [rangeValues, setRangeValues] = useState({
    anxiety_level: 0,
    depression: 0,
    self_esteem: 0,
  });
  const [resultMessage, setResultMessage] = useState("");

  // Generate questions only once when the component mounts
  useEffect(() => {
    const initialQuestions = {
      anxiety_level:
        categories.anxiety_level[
          Math.floor(Math.random() * categories.anxiety_level.length)
        ],
      depression:
        categories.depression[
          Math.floor(Math.random() * categories.depression.length)
        ],
      self_esteem:
        categories.self_esteem[
          Math.floor(Math.random() * categories.self_esteem.length)
        ],
      bullying: categories.bullying[0],
      headache: categories.headache[0],
      basic_needs: categories.basic_needs[0],
      safety: categories.safety[0],
      future_career_concerns: getQuarterOfQuestions(
        categories.future_career_concerns,
      ),
      sleep_quality: getQuarterOfQuestions(categories.sleep_quality),
      academic_performance: getQuarterOfQuestions(
        categories.academic_performance,
      ),
    };
    setSelectedQuestions(initialQuestions);
  }, []);

  const handleInputChange = (category, index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [`${category}_${index}`]: value,
    }));

    // Update range display for single-range categories
    if (["anxiety_level", "depression", "self_esteem"].includes(category)) {
      setRangeValues((prev) => ({
        ...prev,
        [category]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compute averages for quarterCategories
    let processedData = { ...formData };

    for (let cat of quarterCategories) {
      const catQuestions = selectedQuestions[cat];
      if (Array.isArray(catQuestions) && catQuestions.length > 0) {
        let sum = 0;
        let count = 0;

        catQuestions.forEach((q, i) => {
          const val = processedData[`${cat}_${i}`];
          if (typeof val === "number") {
            sum += val;
            count++;
          }
        });

        if (count > 0) {
          const avg = Math.floor(sum / count);
          // Remove individual question keys
          catQuestions.forEach((q, i) => {
            delete processedData[`${cat}_${i}`];
          });
          processedData[cat] = avg;
        } else {
          processedData[cat] = 0;
        }
      }
    }

    // Now handle single-question categories (already stored)
    // anxiety_level, depression, self_esteem are from range values
    // They are stored as anxiety_level_0, etc., so we can just re-map them:
    processedData.anxiety_level = rangeValues.anxiety_level;
    delete processedData["anxiety_level_0"];

    processedData.depression = rangeValues.depression;
    delete processedData["depression_0"];

    processedData.self_esteem = rangeValues.self_esteem;
    delete processedData["self_esteem_0"];

    // bullying, headache, basic_needs, safety are single response categories
    // They are also stored as bullying_0, headache_0, etc.
    // Let's just map them directly:
    if (processedData["bullying_0"] !== undefined) {
      processedData.bullying = processedData["bullying_0"];
      delete processedData["bullying_0"];
    }

    if (processedData["headache_0"] !== undefined) {
      processedData.headache = processedData["headache_0"];
      delete processedData["headache_0"];
    }

    if (processedData["basic_needs_0"] !== undefined) {
      processedData.basic_needs = processedData["basic_needs_0"];
      delete processedData["basic_needs_0"];
    }

    if (processedData["safety_0"] !== undefined) {
      processedData.safety = processedData["safety_0"];
      delete processedData["safety_0"];
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/predict`,
        processedData,
      );
      const prediction = response.data.prediction;

      // Show test result as a toast
      toast.success(`Test Result: ${prediction}`);

      // Provide recommendations based on prediction value
      let message = "";
      if (prediction === 0) {
        // Stress level: Normal
        message =
          "Your stress level appears to be Normal. Great job! Continue maintaining a balanced lifestyle, including regular exercise, a healthy diet, and good sleep habits to keep stress at bay.";
      } else if (prediction === 1) {
        // Stress level: Moderate
        message =
          "Your stress level appears to be Moderate. Consider mindfulness practices, exercise, or talking with friends or family. Small steps can help reduce stress and improve your well-being.";
      } else if (prediction === 2) {
        // Stress level: High
        message =
          "Your stress level appears to be High. It might be beneficial to seek professional support such as a therapist or counselor. You deserve help and understanding during challenging times.";
      }

      setResultMessage(message);

      // Save this analysis result to the backend
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (token) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/analysis`,
          { prediction, analysisData: processedData },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
    } catch (error) {
      toast.error("Failed to analyze the test. Please try again.");
    }
  };

  // Return null or a loader if questions not ready
  if (!selectedQuestions.anxiety_level) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl text-indigo-800 font-bold mb-4 text-center">
        Mental Health Test
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Anxiety Level */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Anxiety Level</h3>
          <p>{selectedQuestions.anxiety_level}</p>
          <input
            type="range"
            min="0"
            max="21"
            value={rangeValues.anxiety_level}
            onChange={(e) =>
              handleInputChange("anxiety_level", 0, parseInt(e.target.value))
            }
            className="w-full mt-2"
          />
          <span className="text-gray-600">
            Selected Value: <strong>{rangeValues.anxiety_level}</strong>
          </span>
        </div>

        {/* Depression */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Depression</h3>
          <p>{selectedQuestions.depression}</p>
          <input
            type="range"
            min="0"
            max="27"
            value={rangeValues.depression}
            onChange={(e) =>
              handleInputChange("depression", 0, parseInt(e.target.value))
            }
            className="w-full mt-2"
          />
          <span className="text-gray-600">
            Selected Value: <strong>{rangeValues.depression}</strong>
          </span>
        </div>

        {/* Self Esteem */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Self Esteem</h3>
          <p>{selectedQuestions.self_esteem}</p>
          <input
            type="range"
            min="0"
            max="30"
            value={rangeValues.self_esteem}
            onChange={(e) =>
              handleInputChange("self_esteem", 0, parseInt(e.target.value))
            }
            className="w-full mt-2"
          />
          <span className="text-gray-600">
            Selected Value: <strong>{rangeValues.self_esteem}</strong>
          </span>
        </div>

        {/* Bullying */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Bullying</h3>
          <p>{selectedQuestions.bullying}</p>
          <select
            onChange={(e) =>
              handleInputChange("bullying", 0, parseInt(e.target.value))
            }
            className="block w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Headache */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Headache</h3>
          <p>{selectedQuestions.headache}</p>
          <select
            onChange={(e) =>
              handleInputChange("headache", 0, parseInt(e.target.value))
            }
            className="block w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Needs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Basic Needs</h3>
          <p>{selectedQuestions.basic_needs}</p>
          <select
            onChange={(e) =>
              handleInputChange("basic_needs", 0, parseInt(e.target.value))
            }
            className="block w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Safety */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Safety</h3>
          <p>{selectedQuestions.safety}</p>
          <select
            onChange={(e) =>
              handleInputChange("safety", 0, parseInt(e.target.value))
            }
            className="block w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Future Career Concerns - multiple questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Future Career Concerns</h3>
          {selectedQuestions.future_career_concerns &&
            selectedQuestions.future_career_concerns.map((question, index) => (
              <div key={index} className="mb-4">
                <p>{question}</p>
                <select
                  onChange={(e) =>
                    handleInputChange(
                      "future_career_concerns",
                      index,
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-full mt-1 p-2 border rounded"
                  required
                >
                  <option value="">Select an option</option>
                  {options.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>

        {/* Sleep Quality - multiple questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sleep Quality</h3>
          {selectedQuestions.sleep_quality &&
            selectedQuestions.sleep_quality.map((question, index) => (
              <div key={index} className="mb-4">
                <p>{question}</p>
                <select
                  onChange={(e) =>
                    handleInputChange(
                      "sleep_quality",
                      index,
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-full mt-1 p-2 border rounded"
                  required
                >
                  <option value="">Select an option</option>
                  {options.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>

        {/* Academic Performance - multiple questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Academic Performance</h3>
          {selectedQuestions.academic_performance &&
            selectedQuestions.academic_performance.map((question, index) => (
              <div key={index} className="mb-4">
                <p>{question}</p>
                <select
                  onChange={(e) =>
                    handleInputChange(
                      "academic_performance",
                      index,
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-full mt-1 p-2 border rounded"
                  required
                >
                  <option value="">Select an option</option>
                  {options.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
        >
          Submit Test
        </button>
      </form>

      {resultMessage && (
        <div className="mt-8 p-6 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">
            Your Stress Level Analysis
          </h3>
          <p className="text-gray-700">{resultMessage}</p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/report")}
              className="text-indigo-600 hover:underline"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
