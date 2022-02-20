### Dispatch
## A Resource for Freelance Management



The application Dispatch is intended to handle Freelance Management for a variety of organizations. It is for managers trying to organize delivery drivers, volunteer organizations managing the tasks of a group of volunteers or for event coordinators managing a team of freelancers.

The users of the app are divided into three entities: Organizations, Managers and Freelancers.

Organizations are entities that have an event and they want to assign a Manager to organize a team to handle the event.

Managers are entities that receive the event from organizations and assign that event or events to Freelancers. 

Freelancers are entities that receive the event from a Manager and are responsible for completing the tasks associated with that event.

The app will help make the process of managing events and following the progress of the people completing tasks simpler and stress free.


## Project Overview
#Organization Entity

•	The Organization can add and delete Managers to their list of Managers available to handle events. </br>
•	The Organization can create an event with Name, Location, Time, Special Requirements and can assign it to a Manager. The Organization can also view a list of task templates created by the Manager and attach the template to the event. These templates will contain preset tasks, alerts and other parameters that are commonly repeated with specific types of event. </br>
•	The Organization can view a list of upcoming, in progress and completed events that it has already created. The Organization can open an event to see the status of tasks associated with the event and any comments/feedback about the event. </br>
•	The Organization can send messages to Managers. Managers can send messages to Organizations and Freelancers. Freelancers can send messages to Managers. Freelancers  and Organizations cannot message each other. </br>

#Manager Entity

•	The Manager can invite or delete Freelancers to their list of Freelancers that can work events for them. </br>
•	The Manager can accept or decline events sent to them from Organizations. If accepted, the Manager can assign a Freelancer to an event or leave it unassigned and available for pickup by a Freelancer. If a task template has not already been assigned to the event, the Manager can assign a task template to the event. The Manager can also customize the list of tasks and alerts.</br>
•	The Manager can create or customize task templates that have a list of time-scheduled tasks and alerts that are commonly associated with frequent types of events. </br>
•	The Manager  can create their own events if the Organization  is not a member of the app. </br>
•	The Manager can view real-time updates on tasks completed on in progress events. They can also receive alerts if a task is falling behind with an option to message the Freelancer.</br>

#Freelancer Entity

•	The Freelancer can accept or decline events assigned to them. They can also view a list of unassigned events associated with Managers they are connected with and accept the unassigned event. The Manager will have an option to reject the Freelancer who has picked up the unassigned event.</br>
•	The Freelancer can view a schedule of upcoming, in progress and completed events. They can open an event to view details of the event, including a list of tasks and comments about the event. </br>
•	The Freelancer can open an in progress event where a task list will be displayed. When a task is complete, the Freelancer can swipe left on the task to update the status of that task. The status will then be sent to the Manager.</br>
•	The Freelancer can leave comments about the event re: issues, improvements, etc.</br>
