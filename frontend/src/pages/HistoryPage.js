import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/analysis`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAnalyses(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
    fetchAnalyses();
  }, [token]);

  const handleDownload = async (analysisId) => {
    try {
      // Fetch the single analysis by ID
      const { data: singleAnalysis } = await axios.get(
        `${process.env.REACT_APP_API_URL}/analysis/${analysisId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const { _id, prediction, analysisData, createdAt } = singleAnalysis;

      let stressLevel = "Normal";
      if (prediction === 1) stressLevel = "Moderate";
      else if (prediction === 2) stressLevel = "High";

      const doc = new jsPDF();
      let yPos = 10;
      doc.setFontSize(18);
      doc.text("Mental Health Analysis Report", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Report ID: ${_id}`, 10, yPos);
      yPos += 10;

      if (profile) {
        doc.text(`Name: ${profile.name || ""}`, 10, yPos);
        yPos += 6;
        doc.text(`Email: ${profile.email || ""}`, 10, yPos);
        yPos += 6;
        doc.text(`Date of Birth: ${profile.dateOfBirth || ""}`, 10, yPos);
        yPos += 6;
        doc.text(`Age: ${profile.age || ""}`, 10, yPos);
        yPos += 6;
        doc.text(`Academic Status: ${profile.academicStatus || ""}`, 10, yPos);
        yPos += 10;
      }

      doc.text(`Date: ${new Date(createdAt).toLocaleString()}`, 10, yPos);
      yPos += 10;
      doc.text(`Your stress level: ${stressLevel}`, 10, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.text("Analysis Breakdown:", 10, yPos);
      yPos += 8;
      doc.setFontSize(12);

      Object.entries(analysisData).forEach(([category, value]) => {
        doc.text(`${category.replaceAll("_", " ")}: ${value}`, 10, yPos);
        yPos += 6;
      });

      doc.save(`report_${_id}.pdf`);
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Your Analysis History
      </h2>
      {analyses.length === 0 ? (
        <p className="text-gray-700">No analyses found.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="border-b bg-indigo-50">
              <th className="p-2">ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Stress Level</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((analysis) => {
              let stressLevel = "Normal";
              if (analysis.prediction === 1) stressLevel = "Moderate";
              else if (analysis.prediction === 2) stressLevel = "High";

              return (
                <tr key={analysis._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{analysis._id}</td>
                  <td className="p-2">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2">{stressLevel}</td>
                  <td className="p-2 flex space-x-4">
                    <a
                      href={`/report`}
                      className="text-indigo-600 hover:underline"
                    >
                      View Report
                    </a>
                    <button
                      onClick={() => handleDownload(analysis._id)}
                      className="text-indigo-600 hover:underline"
                    >
                      Download Report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPage;
