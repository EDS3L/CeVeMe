import React from 'react';
import Headline from './Headline';
import Summary from './Summary';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import Skills from './SkillCategory';
import Experience from './Experience';
import Portfolio from './Portfolio';
import Certificates from './Certificates';
import GDPRClause from './GDPRClause';

export default function CVViewer({ cvData = {} }) {
  const {
    headline = '',
    summary = '',
    personalData: {
      name = '',
      city = '',
      phone = '',
      email = '',
      links = [],
    } = {},
    education = [],
    skills: { technical = [], tools = [], soft = [] } = {},
    experience = [],
    portfolio = [],
    certificates = [],
    gdprClause = '',
  } = cvData;

  return (
    <div className="max-w-screen-lg mx-auto bg-white p-10 shadow-md">
      <Headline text={headline} />
      <Summary text={summary} />
      <PersonalInfo {...{ name, city, phone, email, links }} />
      <Education items={education} />
      <Skills technical={technical} tools={tools} soft={soft} />
      <Experience items={experience} />
      <Portfolio items={portfolio} />
      <Certificates items={certificates} />
      <GDPRClause text={gdprClause} />
    </div>
  );
}
