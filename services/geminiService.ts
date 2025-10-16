// Fix: Create the content for the missing geminiService.ts file.
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

// Fix: As per guidelines, initialize GoogleGenAI with a named apiKey parameter from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonPlan = async (topic: string, grade: string, duration: string): Promise<string> => {
    const prompt = `Create a detailed lesson plan for a ${duration}-minute class on the topic "${topic}" for ${grade} students. The lesson plan should include learning objectives, materials needed, step-by-step activities (including introduction, main activity, and conclusion), and an assessment method. Format the output in markdown.`;

    try {
        // Fix: Use the recommended 'gemini-2.5-pro' model for complex text tasks.
        // Fix: Use the correct API call `ai.models.generateContent` as per the guidelines.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        // Fix: Access the generated text directly from the 'text' property of the response object.
        return response.text;
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        return "Sorry, I was unable to generate a lesson plan at this time. Please try again later.";
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const extractStudentsFromFile = async (file: File): Promise<Partial<Student>[]> => {
    const base64Data = await fileToBase64(file);

    const prompt = `
        Extract student information from the provided document (which could be an image, a scanned document, or a PDF).
        The document may contain a table, a list, or unstructured text about students.
        Identify and extract the following details for each student:
        - studentId: The unique student identifier (e.g., 'S-001').
        - rollNo: The student's roll number in their class.
        - name: The full name of the student.
        - class: The grade or class number (e.g., 10).
        - section: The class section (e.g., 'A', 'B').
        - gender: The student's gender ('Male', 'Female', 'Other').
        - parentName: The name of the parent or guardian.
        - contact: The contact phone number.
        - admissionDate: The date of admission (format as YYYY-MM-DD).
        - status: The student's current status ('Active', 'Graduated', 'Suspended').
        - email: The student's email address.
        - attendance: The attendance percentage (as a number, without the '%' sign).

        Return the data as a JSON array, where each object represents a single student.
        If a specific field for a student is not found, omit it from the object.
        Even if there is only one student, return it inside an array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: file.type,
                            data: base64Data,
                        },
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            studentId: { type: Type.STRING, description: "Student's unique ID" },
                            rollNo: { type: Type.NUMBER, description: "Student's roll number" },
                            name: { type: Type.STRING, description: "Student's full name" },
                            class: { type: Type.NUMBER, description: "Student's class/grade" },
                            section: { type: Type.STRING, description: "Student's class section" },
                            gender: { type: Type.STRING, description: "Student's gender" },
                            parentName: { type: Type.STRING, description: "Parent's name" },
                            contact: { type: Type.STRING, description: "Contact number" },
                            admissionDate: { type: Type.STRING, description: "Admission date in YYYY-MM-DD format" },
                            status: { type: Type.STRING, description: "Student's status" },
                            email: { type: Type.STRING, description: "Student's email" },
                            attendance: { type: Type.NUMBER, description: "Attendance percentage" },
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const extractedData = JSON.parse(jsonString);
        
        return extractedData as Partial<Student>[];

    } catch (error) {
        console.error("Error extracting student data:", error);
        throw new Error("Failed to extract student data. The document might be unreadable or in an unsupported format.");
    }
};
