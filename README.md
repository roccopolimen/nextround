# NextRound (CS 554: Final Project)

With COVID-19 and job recruitment transitioning over to the Internet, managing job applications and their progress has become much more stressful. Remembering which positions you have applied for, monitoring upcoming events, and tracking your application progress can easily pile up and become overwhelming if not well managed. Additionally, many employees want to maintain a competitive salary and consequently re-enter the hiring cycle as short as every two to three years. NextRound will help users manage, organize, and evaluate their job applications per cycle.

## Developers

| Full Name      |
| -------------- |
| Michael Karsen |
| Grace Mattern  |
| Marco Polimeni |
| Rocco Polimeni |
| Brian Wormser  |

## Trello Board

[Trello Board (view only)](https://trello.com/b/2uC6Y9YJ)

## Interactive Prototype

[Prototype (view only)](https://www.figma.com/proto/3kAio2BKwoY79aeBQjWEtm/NextRound-Wireframe?page-id=0%3A1&node-id=2%3A2&viewport=261%2C48%2C0.33&scaling=scale-down&starting-point-node-id=2%3A2)

## Git Workflow

Only changes made within src/ will require working in branches. Documents can be pushed directly to main when needed.

### Setting up a branch

```
# create a new branch locally, and enter it
git checkout -b <name-of-branch>
```
The first **Push** after creating a new branch locally will require:
```
git push -u origin <name-of-branch>
```
This ensures that the branch is tracked properly on the remote repository.

### Basic Version Control

#### Develop in your Branch

During development of the feature branch, stay within your branch. To check this use:
```
git branch
```
and if you are not in the proper branch, go to it with:
```
git checkout <name-of-branch>
```
In this branch, you **should** be the only one developing within it. Just in case, make sure you are up-to-date with the remote branch:
```
# if you haven't made this branch remote yet, this will not work. Skip it.
git pull
```

#### Code changes in the Branch

After writing a feature, and before moving on to the next one, update the remote branch with your changes.
```
# stages your changes
git add .

# labels the changes you made as a commit
# it may be useful to reference the name of the trello card this commit is attached to.
git commit -m "<describe-your-commit>"

# just in case, pull first to avoid merging problems
# if you haven't made this branch remote yet, this will not work. Skip it.
git pull

# push your changes to master. (If first push on this local branch, see above)
git push
```

### Completing a Feature

Once a feature is ready to be merged into the main codebase, we want to **create a pull request.**
To do this:

1. Make sure all of the code is pushed to the remote branch
1. Go to the Github, and click the 'Pull Requests' tab.
1. Click the Green button 'New pull request'.
1. **base** should be 'main' and **compare** should be your branch which you can select from its dropdown.
1. Once 'base' and 'compare' are set, click 'Create pull request'.
1. Give it a title in reference to the Trello card describing the feature, and a brief description.
1. Alert other team members via Slack to go review your pull request.
1. Move the trello card for this feature to 'Code Review'.

### Reviewing a Feature

We want a minimum of **2** people to review a code feature. things to look for:

- Meets requirements
- Code is clean, and well commented. Should not be tedious to figure out what is going on.
- Suggestions on a better way to do things are strongly encouraged. This codebase should be well maintained.

After leaving comments, go into Slack and alert the initial contributor (via messaging **in the thread** where they initially announced they made a pull request).

After the contributor and both reviewers have reached consensus, one must click the 'Merge pull request' button and move the trello card for that feature into 'Merged'. Test

### Deleting a Branch

After merging a feature, that branch will now be unnecessary. Delete the branch on GitHub and pull these changes to your local so your local list of branches matches with remote.

