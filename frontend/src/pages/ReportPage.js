import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const ReportPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/analysis`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // data is an array of analyses, sorted by createdAt desc in our controller
        if (data.length > 0) setAnalysis(data[0]);
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
    fetchLatestAnalysis();
  }, [token]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString),
    );
  };

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Report</h2>
        <p>No analysis report found.</p>
      </div>
    );
  }

  const { _id, prediction, analysisData, createdAt } = analysis;

  let stressLevel = "Normal";
  if (prediction === 1) stressLevel = "Moderate";
  else if (prediction === 2) stressLevel = "High";

  const handleDownloadPDF = () => {
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
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Detailed Report</h2>
      {profile && (
        <div className="mb-4 text-gray-700">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Date of Birth:</strong> {formatDate(profile.dateOfBirth)}
          </p>
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Academic Status:</strong> {profile.academicStatus}
          </p>
        </div>
      )}
      <p className="text-gray-700 mb-4">
        <strong>Report ID:</strong> {_id}
      </p>
      <p className="text-gray-700 mb-4">Date: {formatDate(createdAt)}</p>
      <p className="mb-4">
        Your stress level: <strong>{stressLevel}</strong>
      </p>
      <h3 className="text-xl font-bold mb-2 text-indigo-700">
        Analysis Breakdown:
      </h3>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {Object.entries(analysisData).map(([category, value]) => (
          <li key={category}>
            <strong>{category.replaceAll("_", " ")}:</strong> {value}
          </li>
        ))}
      </ul>
      <button
        onClick={handleDownloadPDF}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
      >
        Download Report as PDF
      </button>
    </div>
  );
};

export default ReportPage;
