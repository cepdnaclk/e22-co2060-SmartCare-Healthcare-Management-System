---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e22-co2060-Smartcare-Healthcare-managemnet-system
title: Smartcare-Healthcare-managemnet-system
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template, and add more information required for your own project"

<!-- Once you fill the index.json file inside /docs/data, please make sure the syntax is correct. (You can use this tool to identify syntax errors)

Please include the "correct" email address of your supervisors. (You can find them from https://people.ce.pdn.ac.lk/ )

Please include an appropriate cover page image ( cover_page.jpg ) and a thumbnail image ( thumbnail.jpg ) in the same folder as the index.json (i.e., /docs/data ). The cover page image must be cropped to 940×352 and the thumbnail image must be cropped to 640×360 . Use https://croppola.com/ for cropping and https://squoosh.app/ to reduce the file size.

If your followed all the given instructions correctly, your repository will be automatically added to the department's project web site (Update daily)

A HTML template integrated with the given GitHub repository templates, based on github.com/cepdnaclk/eYY-project-theme . If you like to remove this default theme and make your own web page, you can remove the file, docs/_config.yml and create the site using HTML. -->

# Project Title

---

## Team
-  E/22/323, Anushka Madawa, [e22323@eng.pdn.ac.lk](mailto:name@email.com)
-  E/22/131, Hansika Iddagoda, [e22131@eng.pdn.ac.lk](mailto:name@email.com)
-  E/22/427, Hansaka Wickramarathna, [e22427@eng.pdn.ac.lk](mailto:name@email.com)
-  E/22/322, Tharusha Rashmika
, [e22322@eng.pdn.ac.lk](mailto:name@email.com) 

<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture )
3. [Software Designs](#hardware-and-software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

## Introduction

In many hospitals and clinics, appointment management is still manual or semi-digital, relying on phone calls, reception desks, or basic forms. This creates several real-world problems:

Long waiting times
Patients must call or physically visit hospitals just to book an appointment.

Overloaded staff
Receptionists spend a large amount of time answering repetitive questions instead of focusing on patient care.

Poor patient experience
Patients struggle to explain symptoms clearly and often receive incorrect appointment slots.

Inefficient data handling
Patient information is scattered, inconsistent, or entered multiple times, leading to errors.

Limited accessibility
Appointment systems are not available 24/7 and are difficult for elderly or remote patients.

Because of these issues, healthcare providers face reduced efficiency, higher operational costs, and lower patient satisfaction


## Solution Architecture

The proposed AI-based Healthcare Appointment System follows a multi-layered architecture consisting of the user interface layer, application layer, AI processing layer, and database layer. Patients interact with the system through a web-based chat interface developed using modern frontend technologies. When a user sends a message describing their symptoms or appointment request, the message is transmitted to the backend server built with Node.js and Express. The backend acts as the central controller, managing business logic, validating inputs, and coordinating communication between the AI engine and the database. The AI component processes natural language input, extracts relevant information such as patient name, age, medical issue, and preferred appointment date, and returns structured data in a machine-readable format. The backend then stores this structured information securely in a MongoDB database, creating patient records and booking appointments accordingly. Finally, a confirmation response is sent back to the user through the frontend interface. This layered architecture ensures scalability, security, modularity, and efficient real-time appointment management while maintaining clear separation between user interaction, intelligent processing, and data storage components.

## Software Designs

Detailed designs with many sub-sections

## Testing

Testing done on software : detailed + summarized results

## Conclusion

What was achieved, future developments, commercialization plans

## Links

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name}}){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
