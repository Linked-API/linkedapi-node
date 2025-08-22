## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Linked API](#-linked-api)
- [Best Practices](#-best-practices)
- [Error Handling](#-error-handling)
- [TypeScript Support](#-typescript-support)
- [License](#-license)

## 🚀 Installation

```bash
npm install linkedapi-node
```

## ⚡ Quick Start

> **⚠️ Note:** This package is currently in beta. Features and APIs are subject to change.

This official Linked API package simplifies interaction with LinkedIn's functionalities by wrapping the [Linked API](https://linkedapi.io), making it easier to build applications without dealing with complex API calls.

You can find various examples in the `/examples` folder to help you get started.

```typescript
import LinkedApi from "linkedapi-node";

// Initialize with your API tokens
const linkedapi = new LinkedApi({
  linkedApiToken: "your-linked-api-token",
  identificationToken: "your-identification-token",
});

// Use Linked API for your LinkedIn account automation
const connectionWorkflowId = await linkedapi.sendConnectionRequest.execute({
  personUrl: "https://www.linkedin.com/in/person1",
  message: "It would be great to add you to my network!",
});
await linkedapi.sendConnectionRequest.result(connectionWorkflowId);

const commentWorkflowId = await linkedapi.commentOnPost.execute({
  postUrl: "https://www.linkedin.com/posts/post1",
  text: "Great post! Thanks for sharing.",
});
await linkedapi.commentOnPost.result(commentWorkflowId);

// Search companies
const searchWorkflowId = await linkedapi.searchCompanies.execute({
  term: "software development", // Search term for company name or description
  filter: {
    locations: ["San Francisco", "New York", "Seattle"],
    industries: ["Technology", "Software", "Artificial Intelligence"],
    sizes: ["51-200", "201-500", "501-1000"],
  },
  limit: 50, // Maximum number of results to return (1-100, default: 10)
});
const companiesResult =
  await linkedapi.searchCompanies.result(searchWorkflowId);

// Retrieving company basic info, employees
const companyWorkflowId = await linkedapi.fetchCompany.execute({
  companyUrl: "https://www.linkedin.com/company/microsoft",
  retrieveEmployees: true, // Get company employees with their profiles
  employeesRetrievalConfig: {
    filter: {
      schools: ["Harvard University", "Stanford University"],
    },
  },
});
const companyResult = await linkedapi.fetchCompany.result(companyWorkflowId);
```

---

## 🔧 Linked API

Linked API lets you manage LinkedIn accounts programmatically through an API interface.

To use Linked API you must initialize with:

- `linkedApiToken` – your main token that enables overall Linked API access.
- `identificationToken` – unique token specific to each managed LinkedIn account.

```typescript
const linkedapi = new LinkedApi({
  linkedApiToken: "your-linked-api-token",
  identificationToken: "your-identification-token",
});
```

You can obtain these tokens through [Linked API Platform](https://app.linkedapi.io?ref=linkedapi-node), as demonstrated below:
![API Tokens](https://linkedapi.io/content/images/size/w1600/2025/07/tokens-1.webp)

**📖 Documentation:** [Documentation](https://linkedapi.io/docs)

---

### `customWorkflow`

Execute custom LinkedIn automation workflows with raw workflow definitions.

- **Parameters:** `TWorkflowDefinition` - Custom workflow definition
- **Result:** `TWorkflowCompletion` - Workflow completion object
- **Documentation:** [Building Workflows](https://linkedapi.io/docs/building-workflows/) | [Executing Workflows](https://linkedapi.io/docs/executing-workflows/) | [Actions Overview](https://linkedapi.io/docs/actions-overview/)

```typescript
const workflowId = await linkedapi.customWorkflow.execute({
  actionType: "st.searchCompanies",
  term: "Tech Inc",
  then: { actionType: "st.doForCompanies", ... }
});
const result = await linkedapi.customWorkflow.result(workflowId);
```

---

### `fetchPerson`

Retrieve comprehensive LinkedIn person profile data including experience, education, skills, and posts.

- **Parameters:** `TBaseFetchPersonParams` - Person URL and data retrieval options
- **Result:** `TMappedResponse<TFetchPersonResult>` - Person profile data

```typescript
const personWorkflowId = await linkedapi.fetchPerson.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
  retrieveExperience: true, // Get work experience and job history
  retrieveEducation: true, // Get educational background and degrees
  retrieveSkills: true, // Get skills and endorsements
  retrieveLanguages: true, // Get languages and proficiency levels
  retrievePosts: true, // Get recent posts and articles
  retrieveComments: true, // Get comments made by the person
  retrieveReactions: true, // Get reactions/likes given by the person
  postsRetrievalConfig: {
    limit: 20, // Maximum number of posts to retrieve (1-20)
    since: "2024-01-01", // Retrieve posts since this date (YYYY-MM-DD)
  },
  commentsRetrievalConfig: {
    limit: 10, // Maximum number of comments to retrieve (1-20)
    since: "2024-01-01", // Retrieve comments since this date
  },
  reactionsRetrievalConfig: {
    limit: 15, // Maximum number of reactions to retrieve (1-20)
    since: "2024-01-01", // Retrieve reactions since this date
  },
});
const personResult = await linkedapi.fetchPerson.result(personWorkflowId);
```

---

### `salesNavigatorFetchPerson`

Retrieve person data through Sales Navigator for enhanced prospecting capabilities.

- **Parameters:** `TNvOpenPersonPageParams` - Sales Navigator person parameters
- **Result:** `TMappedResponse<TNvOpenPersonPageResult>` - Person data from Sales Navigator

```typescript
const nvPersonWorkflowId = await linkedapi.salesNavigatorFetchPerson.execute({
  personHashedUrl: "https://www.linkedin.com/in/ABC123",
});
const personResult =
  await linkedapi.salesNavigatorFetchPerson.result(nvPersonWorkflowId);
```

---

### `fetchCompany`

Retrieve detailed LinkedIn company profile data including employees, posts, and direct messages.

- **Parameters:** `TBaseFetchCompanyParams` - Company URL and data retrieval options
- **Result:** `TMappedResponse<TFetchCompanyResult>` - Company profile data

```typescript
const companyWorkflowId = await linkedapi.fetchCompany.execute({
  companyUrl: "https://www.linkedin.com/company/microsoft",
  retrieveEmployees: true, // Get company employees with their profiles
  retrievePosts: true, // Get recent company posts and updates
  retrieveDMs: true, // Get decision makers and key personnel
  employeesRetrievalConfig: {
    limit: 25, // Maximum number of employees to retrieve (1-500)
    filter: {
      firstName: "John", // Filter by employee first name
      lastName: "Smith", // Filter by employee last name
      position: "engineer", // Filter by job position/title
      locations: ["United States", "Canada"], // Filter by employee locations
      industries: ["Software Development"], // Filter by industries
      currentCompanies: ["Microsoft", "Google"], // Filter by current companies
      previousCompanies: ["Apple", "Amazon"], // Filter by previous companies
      schools: ["Stanford University", "MIT"], // Filter by educational background
    },
  },
  postsRetrievalConfig: {
    limit: 10, // Maximum number of posts to retrieve (1-20)
    since: "2024-01-01", // Retrieve posts since this date (YYYY-MM-DD)
  },
  dmsRetrievalConfig: {
    limit: 5, // Maximum number of decision makers to retrieve
  },
});
const companyResult = await linkedapi.fetchCompany.result(companyWorkflowId);
```

---

### `salesNavigatorFetchCompany`

Retrieve company data through Sales Navigator with advanced filtering and prospecting features.

- **Parameters:** `TNvBaseFetchCompanyParams` - Sales Navigator company parameters
- **Result:** `TMappedResponse<TNvFetchCompanyResult>` - Company data from Sales Navigator

```typescript
const nvCompanyWorkflowId = await linkedapi.salesNavigatorFetchCompany.execute({
  companyHashedUrl: "https://www.linkedin.com/sales/company/1035",
  retrieveEmployees: true, // Get company employees with Sales Navigator
  retrieveDMs: true, // Get decision makers
  employeesRetrievalConfig: {
    limit: 25, // Maximum number of employees to retrieve (1-500)
    filter: {
      firstName: "John",
      lastName: "Doe",
      positions: ["Manager", "Executive"],
      locations: ["New York", "San Francisco", "London"],
      industries: ["Software Development", "Professional Services"],
      schools: ["Harvard University", "MIT"],
      yearsOfExperiences: ["threeToFive", "sixToTen"],
    },
  },
  dmsRetrievalConfig: {
    limit: 10, // Maximum number of decision makers to retrieve (1-20)
  },
});
const companyResult =
  await linkedapi.salesNavigatorFetchCompany.result(nvCompanyWorkflowId);
```

---

### `fetchPost`

Retrieve detailed information about a LinkedIn post including content, engagement, and comments.

- **Parameters:** `TFetchPostParams` - Post URL
- **Result:** `TMappedResponse<TFetchPostResult>` - Post data

```typescript
const postWorkflowId = await linkedapi.fetchPost.execute({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
});
const postResult = await linkedapi.fetchPost.result(postWorkflowId);
```

---

### `searchCompanies`

Search for companies on LinkedIn using standard search with advanced filtering options.

- **Parameters:** `TSearchCompanyParams` - Search term, filters, and pagination
- **Result:** `TMappedResponse<TSearchCompanyResult[]>` - Array of company search results

```typescript
const companySearchWorkflowId = await linkedapi.searchCompanies.execute({
  term: "software development", // Search term/keywords for company name or description
  filter: {
    locations: ["San Francisco", "New York", "Seattle"],
    industries: ["Technology", "Software", "Artificial Intelligence"],
    sizes: ["51-200", "201-500", "501-1000"],
  },
  limit: 50, // Maximum number of results to return (1-100, default: 10)
});
const companiesResult = await linkedapi.searchCompanies.result(
  companySearchWorkflowId,
);
```

---

### `salesNavigatorSearchCompanies`

Search for companies using Sales Navigator with advanced prospecting filters.

- **Parameters:** `TNvSearchCompanyParams` - Enhanced search parameters for Sales Navigator
- **Result:** `TMappedResponse<TNvSearchCompanyResult[]>` - Company search results from Sales Navigator

```typescript
const nvCompanySearchId = await linkedapi.salesNavigatorSearchCompanies.execute(
  {
    term: "enterprise software", // Search term for company name, description, or keywords
    filter: {
      locations: ["San Francisco", "New York", "London"],
      industries: ["Software Development", "Enterprise Software", "SaaS"],
      sizes: ["201-500", "501-1000", "1001-5000"],
      annualRevenue: {
        min: "10", // Minimum annual revenue in millions USD
        max: "500", // Maximum annual revenue in millions USD
      },
    },
    limit: 75, // Maximum number of results to return (1-100)
  },
);
const companiesResult =
  await linkedapi.salesNavigatorSearchCompanies.result(nvCompanySearchId);
```

---

### `searchPeople`

Search for people on LinkedIn using standard search with location, experience, and company filters.

- **Parameters:** `TSearchPeopleParams` - Search term, filters, and pagination
- **Result:** `TMappedResponse<TSearchPeopleResult[]>` - Array of people search results

```typescript
const peopleSearchWorkflowId = await linkedapi.searchPeople.execute({
  term: "product manager", // Search term
  filter: {
    firstName: "John",
    lastName: "Doe",
    position: "CEO",
    locations: ["New York", "San Francisco", "London"],
    industries: ["Software Development", "Professional Services"],
    currentCompanies: ["Tech Solutions", "Innovatech"],
    previousCompanies: ["FutureCorp"],
    schools: ["Harvard University", "MIT"],
  },
  limit: 20, // Maximum number of results to return (1-100, default: 10)
});
const peopleResult = await linkedapi.searchPeople.result(
  peopleSearchWorkflowId,
);
```

---

### `salesNavigatorSearchPeople`

Search for people using Sales Navigator with advanced prospecting and lead generation filters.

- **Parameters:** `TNvSearchPeopleParams` - Enhanced search parameters for Sales Navigator
- **Result:** `TMappedResponse<TNvSearchPeopleResult[]>` - People search results from Sales Navigator

```typescript
const nvPeopleSearchId = await linkedapi.salesNavigatorSearchPeople.execute({
  term: "VP Engineering",
  limit: 20, // Maximum number of results to return (1-100, default: 10)
  filter: {
    firstName: "John",
    lastName: "Doe",
    position: "VP Engineering",
    locations: ["New York", "San Francisco", "London"],
    industries: ["Software Development", "Professional Services"],
    currentCompanies: ["Tech Solutions", "Innovatech"],
    previousCompanies: ["FutureCorp"],
    schools: ["Harvard University", "MIT"],
    yearsOfExperience: ["lessThanOne", "oneToTwo", "threeToFive"],
  },
});
const prospectsResult =
  await linkedapi.salesNavigatorSearchPeople.result(nvPeopleSearchId);
```

---

### `sendConnectionRequest`

Send connection requests to LinkedIn users with optional personalized messages.

- **Parameters:** `TSendConnectionRequestParams` - Person URL and optional message
- **Result:** `TMappedResponse<void>` - Connection request sent successfully

```typescript
const workflowId = await linkedapi.sendConnectionRequest.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
  note: "Hello! I'd love to connect and discuss opportunities.",
});
await linkedapi.sendConnectionRequest.result(workflowId);
```

---

### `checkConnectionStatus`

Check the current connection status with a LinkedIn user.

- **Parameters:** `TCheckConnectionStatusParams` - Person URL
- **Result:** `TMappedResponse<TCheckConnectionStatusResult>` - Connection status information

```typescript
const statusWorkflowId = await linkedapi.checkConnectionStatus.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
const statusResult =
  await linkedapi.checkConnectionStatus.result(statusWorkflowId);
```

---

### `withdrawConnectionRequest`

Withdraw previously sent connection requests.

- **Parameters:** `TWithdrawConnectionRequestParams` - Person URL
- **Result:** `TMappedResponse<void>` - Connection request withdrawn successfully

```typescript
const workflowId = await linkedapi.withdrawConnectionRequest.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
await linkedapi.withdrawConnectionRequest.result(workflowId);
```

---

### `retrievePendingRequests`

Retrieve all pending connection requests sent by your account.

- **Parameters:** None
- **Result:** `TMappedResponse<TRetrievePendingRequestsResult[]>` - List of pending connection requests

```typescript
const pendingWorkflowId = await linkedapi.retrievePendingRequests.execute();
const pendingResult =
  await linkedapi.retrievePendingRequests.result(pendingWorkflowId);
console.log("Pending requests:", pendingResult.data.length);
```

---

### `retrieveConnections`

Retrieve existing connections with advanced filtering options.

- **Parameters:** `TRetrieveConnectionsParams` - Filter and pagination options
- **Result:** `TMappedResponse<TRetrieveConnectionsResult[]>` - List of connections

```typescript
const connectionsWorkflowId = await linkedapi.retrieveConnections.execute({
  filter: {
    firstName: "John",
    positions: ["Engineer", "Manager"],
    locations: ["San Francisco", "New York"],
  },
  limit: 100,
});
const connectionsResult = await linkedapi.retrieveConnections.result(
  connectionsWorkflowId,
);
```

---

### `removeConnection`

Remove existing connections from your LinkedIn network.

- **Parameters:** `TRemoveConnectionParams` - Person URL
- **Result:** `TMappedResponse<void>` - Connection removed successfully

```typescript
const workflowId = await linkedapi.removeConnection.execute({
  personUrl: "https://www.linkedin.com/in/former-colleague",
});
await linkedapi.removeConnection.result(workflowId);
```

---

### `reactToPost`

React to LinkedIn posts with various reaction types (like, love, support, etc.).

- **Parameters:** `TReactToPostParams` - Post URL and reaction type
- **Result:** `TMappedResponse<void>` - Reaction applied successfully

```typescript
const workflowId = await linkedapi.reactToPost.execute({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
  reactionType: "like",
});
await linkedapi.reactToPost.result(workflowId);
```

---

### `commentOnPost`

Comment on LinkedIn posts to engage with your network.

- **Parameters:** `TCommentOnPostParams` - Post URL and comment text
- **Result:** `TMappedResponse<void>` - Comment posted successfully

```typescript
const workflowId = await linkedapi.commentOnPost.execute({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
  text: "Great insight! Thanks for sharing.",
});
await linkedapi.commentOnPost.result(workflowId);
```

---

### `retrieveSSI`

Retrieve your LinkedIn Social Selling Index (SSI) score and rankings.

- **Parameters:** None
- **Result:** `TMappedResponse<TRetrieveSSIResult>` - SSI score and industry/network rankings

```typescript
const ssiWorkflowId = await linkedapi.retrieveSSI.execute();
const ssiResult = await linkedapi.retrieveSSI.result(ssiWorkflowId);
```

---

### `retrievePerformance`

Retrieve LinkedIn account performance metrics including profile views and post engagement.

- **Parameters:** None
- **Result:** `TMappedResponse<TRetrievePerformanceResult>` - Performance metrics and analytics

```typescript
const performanceWorkflowId = await linkedapi.retrievePerformance.execute();
const performanceResult = await linkedapi.retrievePerformance.result(
  performanceWorkflowId,
);
```

---

### `getApiUsageStats`

Retrieve Linked API usage statistics for monitoring and optimization.

- **Parameters:** `TApiUsageStatsParams` - Start and end timestamps (max 30 days apart)
- **Returns:** `Promise<TApiUsageStatsResponse>` - Array of executed actions with success/failure data
- **Limitations:** Maximum 30-day range between start and end timestamps

```typescript
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

const statsResponse = await linkedapi.getApiUsageStats({
  start: startDate.toISOString(),
  end: endDate.toISOString(),
});

if (statsResponse.success) {
  console.log("Total actions:", statsResponse.result?.length);
  statsResponse.result?.forEach((action) => {
    console.log(
      `${action.actionType}: ${action.success ? "SUCCESS" : "FAILED"}`,
    );
  });
}
```

---

### `sendMessage`

Send messages to LinkedIn users through standard LinkedIn messaging.

- **Parameters:** `TSendMessageParams` - Person URL and message text
- **Result:** `TMappedResponse<void>` - Message sent successfully

```typescript
const workflowId = await linkedapi.sendMessage.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
  text: "Hello! I saw your post about AI and wanted to connect.",
});
await linkedapi.sendMessage.result(workflowId);
```

---

### `syncConversation`

Sync conversation history with a LinkedIn user for message polling.

- **Parameters:** `TSyncConversationParams` - Person URL
- **Result:** `TMappedResponse<void>` - Conversation synced successfully
- **Related Methods:** Use with `pollConversations()` to retrieve message history

```typescript
const workflowId = await linkedapi.syncConversation.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
await linkedapi.syncConversation.result(workflowId);
```

---

### `salesNavigatorSendMessage`

Send messages through Sales Navigator with enhanced messaging capabilities.

- **Parameters:** `TNvSendMessageParams` - Person URL, message text, and optional subject
- **Result:** `TMappedResponse<void>` - Sales Navigator message sent successfully

```typescript
const workflowId = await linkedapi.salesNavigatorSendMessage.execute({
  personUrl: "https://www.linkedin.com/sales/people/ABC123",
  subject: "Partnership Opportunity",
  text: "Hi! I'd love to discuss potential collaboration opportunities.",
});
await linkedapi.salesNavigatorSendMessage.result(workflowId);
```

---

### `salesNavigatorSyncConversation`

Sync Sales Navigator conversation for message polling.

- **Parameters:** `TNvSyncConversationParams` - Person URL
- **Result:** `TMappedResponse<void>` - Sales Navigator conversation synced successfully

```typescript
const workflowId = await linkedapi.salesNavigatorSyncConversation.execute({
  personUrl: "https://www.linkedin.com/sales/people/ABC123",
});
await linkedapi.salesNavigatorSyncConversation.result(workflowId);
```

---

### `pollConversations(conversations)`

Poll multiple conversations to retrieve message history and new messages.

- **Parameters:** `TConversationPollRequest[]` - Array of conversation poll requests
- **Returns:** `Promise<TConversationPollResponse>` - Message history for requested conversations
- **Prerequisites:** Must call `syncConversation()` or `salesNavigatorSyncConversation()` for each person before polling

```typescript
const response = await linkedapi.pollConversations([
  { personUrl: "https://www.linkedin.com/in/john-doe", type: "st" },
  {
    personUrl: "https://www.linkedin.com/sales/people/ABC123",
    type: "nv",
    since: "2024-01-01T00:00:00Z",
  },
]);

if (response.success) {
  response.result?.forEach((conversation) => {
    console.log(
      `Messages from ${conversation.personUrl}:`,
      conversation.messages,
    );
  });
}
```

---

## 💡 Best Practices

### Custom Workflows for Complex Scenarios

For complex multi-step workflows involving multiple actions, it's recommended to use **custom workflows** instead of combining predefined methods. Custom workflows provide better performance, atomicity, and error handling by executing all steps server-side in a single workflow execution.

**When to use custom workflows:**

- Chaining multiple search and data retrieval operations
- Performing bulk actions on search results
- High-volume operations requiring optimal performance

```typescript
// ✅ Recommended: Custom workflow for complex operations
const customWorkflowId = await linkedapi.customWorkflow.execute({
  actionType: "st.searchCompanies",
  term: "AI startup",
  filter: { locations: ["San Francisco"], sizes: ["11-50", "51-200"] },
  limit: 10,
  then: {
    actionType: "st.doForCompanies",
    then: {
      actionType: "st.openCompanyPage",
      then: {
        actionType: "st.retriveCompanyEmployees",
        limit: 5,
        filter: {
          position: ["manager"]
        }
        then: {
          actionType: "st.doForPeople",
          then: {
            actionType: "st.sendConnectionRequest",
            note: "Hi! I'd love to connect.",
            email: "example@example.com"
          },
        },
      },
    },
  },
});

// vs. ❌ Less efficient: Multiple separate API calls
// (Multiple network requests, no atomicity, complex error handling)
try {
  const searchCompaniesWorkflowId = await linkedapi.searchCompanies.execute({
    term: "AI startup",
    filter: { locations: ["San Francisco"], sizes: ["11-50", "51-200"] },
    limit: 10,
  })
  const companies = (await linkedapi.searchCompanies.result(searchCompaniesWorkflowId)).data!;
  for (company of companies) {
    try {
      const companyEmployeesWorkflowId = await linkedapi.fetchCompany.execute({
        retrieveEmployees: true,
        employeesRetrievalConfig: {
          limit: 5,
          filter: {
            position: "manager"
          }
        }
      });
      const employees = (await linkedapi.fetchCompany.result(companyEmployeesWorkflowId)).data!;
      for (employee of employees) {
        try {
          const sendConnectionWorkflowId = await linkedapi.sendConnectionRequest.execute({
            personUrl: employee.publicUrl,
            note: "Hi! I'd love to connect.",
            email: "example@example.com"
          });
          await linkedapi.sendConnectionRequest.result(sendConnectionWorkflowId);
        } catch (sendConnectionError) {
          console.error(sendConnectionError);
        }
      }
    } catch (companyEmployeesError) {
      console.error(companyEmployeesError);
    }
  }
} catch (searchCompaniesError) {
  console.error(searchCompaniesError);
}
```

**📖 Learn more:** [Building Custom Workflows](https://linkedapi.io/docs/building-workflows/) | [Actions Overview](https://linkedapi.io/docs/actions-overview/)

### Workflow Consistency & State Management

Linked API workflows are designed to be resilient and stateful. Each workflow receives a unique `workflowId` that can be used to retrieve results even if your application restarts or loses connection during execution.

When you start a workflow, you can access its ID immediately and store it for later use:

```typescript
// Start a workflow and save the ID
const personWorkflowId = await linkedapi.fetchPerson.execute({
  personUrl: "https://www.linkedin.com/in/john-doe",
  retrieveExperience: true,
});

// Save the workflow ID to your database or persistent storage
console.log("Workflow started with ID:", personWorkflowId);

// Store in database/file/memory for later retrieval
await saveWorkflowToDatabase(personWorkflowId);
try {
  const person = await linkedapi.fetchPerson.result(personWorkflowId);
} finally {
  await deleteWorkflowFromDatabase(personWorkflowId);
}
```

## 🚨 Error Handling

Linked API provides structured error handling for different failure scenarios. There are two types of errors to handle:

### 1. Exceptions (try/catch)

- **`LinkedApiError`** - throws if a [common error](https://linkedapi.io/docs/making-requests/#common-errors) occurs

### 2. Action Errors (errors array)

- **Partial failures** - when some actions in a workflow succeed but others fail
- **Action-specific errors** - errors from individual actions within a workflow that don't cause the entire workflow to fail

```typescript
import LinkedApi, { LinkedApiError } from "linkedapi-node";

try {
  const workflowId = await linkedapi.fetchPerson.execute({
    personUrl: "https://www.linkedin.com/in/invalid-profile",
  });
  const result = await linkedapi.fetchPerson.result(workflowId);

  // Check for partial errors in the response
  if (result.errors && result.errors.length > 0) {
    console.warn("Workflow completed with errors:");
    result.errors.forEach((error) => {
      console.warn(`- ${error.type}: ${error.message}`);
    });
  }

  // Access the data (may be undefined if workflow failed completely)
  if (result.data) {
    console.log("Person data:", result.data);
  } else {
    console.log("No data returned");
  }
} catch (error) {
  if (error instanceof LinkedApiError) {
    console.error("Linked API Error:", error.message);
    console.error("Error Type:", error.type);
    console.error("Details:", error.details);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Common Error Types

- **`linkedApiTokenRequired`** - Missing API token
- **`invalidLinkedApiToken`** - Invalid API token
- **`identificationTokenRequired`** - Missing Indentification token
- **`invalidIdentificationToken`** - Invalid Identification Token
- **`subscriptionRequired`** - No purchased subscription seats available for this LinkedIn account.
- **`invalidRequestPayload`** - Invalid request body/parameters: {validation_message}.
- **`invalidWorkflow`** - Workflow configuration is not valid due to violated action constraints or invalid action parameters: {validation_details}.
- **`plusPlanRequired`** - Some actions in this workflow require the Plus plan.
- **`linkedinAccountSignedOut`** - Your LinkedIn account has been signed out in our cloud browser. This occasionally happens as LinkedIn may sign out accounts after an extended period. You'll need to visit our platform and reconnect your account.
- **`languageNotSupported`** - Your LinkedIn account uses a language other than English, which is currently the only supported option.

### Common Action Error Types

- **`personNotFound`** - Provided URL is not an existing LinkedIn person. (sendMessage, syncConversation, checkConnectionStatus, sendConnectionRequest, withdrawConnectionRequest, removeConnection, fetchPerson, salesNavigatorSendMessage, salesNavigatorSyncConversation, salesNavigatorFetchPerson)
- **`messagingNotAllowed`** - Sending a message to the person is not allowed. (sendMessage, salesNavigatorSendMessage)
- **`alreadyPending`** - Connection request to this person has already been sent and is still pending.(sendConnectionRequest)
- **`alreadyConnected`** - Your LinkedIn account is already connected with this person. (sendConnectionRequest)
- **`emailRequired`** - Person requires an email address to send a connection request. (sendConnectionRequest)
- **`requestNotAllowed`** - LinkedIn has restricted sending a connection request to this person. (sendConnectionRequest)
- **`notPending`** - There is no pending connection request to this person. (withdrawConnectionRequest)
- **`connectionNotFound`** - Person is not in your connections. (removeConnection)
- **`searchingNotAllowed`** - LinkedIn has blocked performing the search due to exceeding limits or other restrictions. (searchCompanies, searchPeople, salesNavigatorSearchCompanies, salesNavigatorSearchPeople)
- **`companyNotFound`** - Provided URL is not an existing LinkedIn company. (fetchCompany, salesNavigatorFetchCompany)
- **`retrievingNotAllowed`** - LinkedIn has blocked performing the retrieval due to exceeding limits or other restrictions. (retrieveConnections, fetchCompany, salesNavigatorFetchCompany)
- **`postNotFound`** - Provided URL is not an existing LinkedIn post. (fetchPost, reactToPost, commentOnPost)
- **`commentingNotAllowed`** - Commenting is not allowed on this post. This could be due to the post author's privacy settings, LinkedIn restrictions on commenting, or because the post type does not support comments. (commentOnPost)
- **`noSalesNavigator`** - Your account does not have Sales Navigator subscription. (salesNavigatorSendMessage, salesNavigatorSyncConversation, salesNavigatorSearchCompanies, salesNavigatorSearchPeople, salesNavigatorFetchCompany, salesNavigatorFetchPerson)

---

## 📄 License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
