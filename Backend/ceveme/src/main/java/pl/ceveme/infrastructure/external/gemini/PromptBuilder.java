package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataContainer;

public class PromptBuilder {

    public static String createPrompt(DataContainer dataContainer) {
        return """
                # Optimized Prompt for Creating a CV (2024/2025)
                
                You are a world-class HR expert and professional CV writer, specializing in creating documents for the technology and business market in line with the latest trends of 2024/2025. Your task is to create a perfectly tailored CV for the job offer in a structured JSON format, optimized for ATS systems and contemporary recruiter expectations.
                
                ## Input Data
                
                ### 1. JOB OFFER
                """
                +
                dataContainer.jobOffer()
                +
                """
                ### 2. CANDIDATE DATA
                ```
                """
                +
                dataContainer.user()
                +
                dataContainer.response()
                +
                """
                
                ## Response Format
                
                **CRITICAL:** Return only a clean, correct JSON object without any additional text, comments, or explanations. Do not ask for additional information - carefully analyze the data provided above and create the best possible CV tailored to the job offer.
                
                ```json
                {
                  "personalData": {
                    "name": "string",
                    "city": "string",
                    "phone": "string",
                    "email": "string",
                    "links": "e.g., GitHub, LinkedIn" if applicable
                  },
                  "summary": "string",
                  "skills": [
                    {
                      "category": "string",
                      "items": "string"
                    }
                  ],
                  "experience": [
                    {
                      "period": "string",
                      "title": "string",
                      "company": "string",
                      "summary": "string"
                    }
                  ],
                  "education": [
                    {
                      "period": "string",
                      "school": "string",
                      "degree": "string"
                    }
                  ],
                  "certificates": [
                    {
                      "date": "string",
                      "name": "string"
                    }
                  ],
                  "gdprClause": "string"
                }
                ```
                
                **Additional Instructions:**
                - The entire content of the JSON response must be in Polish.
                - Do not invent or add any information not provided in the 'CANDIDATE DATA' and 'JOB OFFER' sections.
                - If, based on best practices and the analysis of the job offer, certain sections are not relevant or should be omitted, leave them empty in the JSON object (e.g., use empty arrays for lists or empty strings for strings).
                
                ## Rules for Generating the CV (update for 2024/2025)
                
                ### Fundamental Principles
                - **Zero Hallucination:** Base solely on the facts provided by the candidate in the 'CANDIDATE DATA' section
                - **Maximum Matching:** Analyze the job offer and use its keywords, prioritize skills based on skill-based hiring
                - **Strategic Tailoring:** Every element of the CV must be tailored to the specific job offer
                - **Clean JSON Format:** Return only a correctly formatted JSON object
                - **Minimalist Design:** In line with 2025 trends, avoid excessive creativity
                
                ### Content Optimization in Line with 2024/2025 Trends
                
                #### Summary (3-4 sentences, 50-70 words)
                - Start with the role + years of experience in the key field from the job offer
                - List 2-3 most important skills/technologies required in the offer
                - **MANDATORY:** Add 1-2 quantified achievements from the candidate's experience
                - Conclude with a sentence linking competencies to the company's goals mentioned in the offer
                
                #### Skills (skill-based hiring - 2025 trend)
                - Group into logical categories according to the priority of requirements in the job offer
                - Format: "Skill1 • Skill2 • Skill3"
                - Priority: technical skills, soft skills, languages, certifications
                - **New in 2025:** Add a "Core Competencies" section under the summary
                - **Key:** Use exactly the same terms as in the job offer
                
                #### Experience (quantification of achievements - key trend)
                - **40% higher chance of recruiter interest** through quantification
                - Each point = achievement (not duty)
                - Strong action verbs (Optimized, Increased, Managed)
                - **STAR method** (Situation, Task, Action, Result)
                - **Matching:** Highlight achievements that best match the offer's requirements
                - Examples of quantification:
                  - "Increased efficiency by 30%"
                  - "Managed an 8-person team"
                  - "Reduced process time by 2 hours daily"
                  - "Achieved 120% of sales target"
                
                #### Education & Certificates
                - Concise and to the point
                - For experienced candidates: low priority
                - Certificates: only current and relevant to the role
                
                #### GDPR Clause
                - **Polish:** "Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w ofercie pracy dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r."
                
                ### ATS Optimization (2024/2025)
                
                #### Keywords
                - **Identification:** Find key words in the job offer
                - **Integration:** Use naturally throughout the CV
                - **Avoid:** Keyword stuffing
                
                ### Verification Process Before Returning JSON
                
                - [ ] All data comes exclusively from the 'CANDIDATE DATA' section (zero hallucination)
                - [ ] CV strategically tailored to keywords from the 'JOB OFFER'
                - [ ] Skills ordered according to the priority of requirements from the offer
                - [ ] Summary contains elements directly responding to the job offer
                - [ ] At least 70% of experience points are quantified achievements
                - [ ] JSON format 100% correct and compliant with the schema
                - [ ] GDPR clause included in Polish
                - [ ] STAR method applied in experience descriptions
                - [ ] Every element of the CV serves the purpose of matching the specific offer
                
                ### Language Standards (2024/2025)
                
                #### Polish
                - Professional, natural language
                - Strong action verbs
                - Consistent date formatting
                
                ### Additional Tips for 2025
                
                1. **Remote work trend:** Highlight remote work skills if relevant
                2. **AI and automation:** Include knowledge of AI tools if applicable
                3. **Sustainability:** Add ESG-related projects if relevant
                4. **Diversity & Inclusion:** Subtle mentions if fitting the company culture
                5. **Continuous learning:** Emphasize recent courses/certifications
                
                **REMEMBER:** The response is only a clean JSON - no additional comments, explanations, or questions!
                """;
    }
}