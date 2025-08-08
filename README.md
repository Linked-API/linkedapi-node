## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Linked API](#-linked-api)
- [Best Practices](#-best-practices)
- [Workflow Consistency & State Management](#-workflow-consistency--state-management)
- [Error Handling](#-error-handling)
- [TypeScript Support](#-typescript-support)
- [License](#-license)

## 🚀 Installation

```bash
npm install linkedapi-node
```

## ⚡ Quick Start

This official Linked API package simplifies interaction with LinkedIn's functionalities by wrapping the [Linked API](https://linkedapi.io), making it easier to build applications without dealing with complex API calls.

You can find various examples in the `/examples` folder to help you get started.

```typescript
import LinkedApi from "linkedapi-node";

// Initialize with your API tokens
const linkedapi = new LinkedApi({
  apiToken: "your-api-token",
  identificationToken: "your-identification-token",
});

// Use Linked API for your LinkedIn account automation
const connectionWorkflow = await linkedapi.sendConnectionRequest({
  personUrl: "https://www.linkedin.com/in/person1",
  message: "It would be great to add you to my network!",
});
await connectionWorkflow.result();

const commentWorkflow = await linkedapi.commentOnPost({
  postUrl: "https://www.linkedin.com/posts/post1",
  text: "Great post! Thanks for sharing.",
});
await commentWorkflow.result();

// Search companies
const searchCompaniesWorkflow = await linkedapi.searchCompanies({
  filter: {
    sizes: ["11-50", "51-200", "201-500", "501-1000"],
    locations: ["California", "Wyoming", "Texas"],
    industries: ["Software Development", "Robotics Engineering"],
  },
});
const companies = await searchCompaniesWorkflow.result();

// Retrieving company basic info, employees
const companyWorkflow = await linkedapi.fetchCompany({
  companyUrl: "https://www.linkedin.com/company/company1",
  retrieveEmployees: true,
  employeeRetrievalConfig: {
    filter: {
      schools: ["Harvard University", "Stanford University"],
    },
  },
});
const company = await companyWorkflow.result();
```

---

## 🔧 Linked API

Linked API lets you manage LinkedIn accounts programmatically through an API interface.

To use Linked API you must initialize with:

- `apiToken` – your main token that enables overall Linked API access.
- `identificationToken` – unique token specific to each managed LinkedIn account.

```typescript
const linkedapi = new LinkedApi({
  apiToken: "your-api-token",
  identificationToken: "your-identification-token",
});
```

You can obtain these tokens through [Linked API Platform](https://app.linkedapi.io/account-api?ref=linkedapi-node), as demonstrated below:
![API Tokens](https://linkedapi.io/content/images/size/w1600/2025/07/tokens-1.webp)

**📖 Documentation:** [Documentation](https://linkedapi.io/docs/account-api/)

---

### `executeCustomWorkflow(params)`

Execute custom LinkedIn automation workflows with raw workflow definitions.

- **Parameters:** `TWorkflowDefinition` - Custom workflow definition
- **Returns:** `Promise<WorkflowHandler>` - Workflow handler for result management
- **Documentation:** [Building Workflows](https://linkedapi.io/docs/account-api/building-workflows/) | [Executing Workflows](https://linkedapi.io/docs/account-api/executing-workflows/) | [Actions Overview](https://linkedapi.io/docs/account-api/actions-overview/)

```typescript
const workflow = await linkedapi.executeCustomWorkflow({
  actionType: "st.searchCompanies",
  term: "Tech Inc",
  then: { actionType: "st.doForCompanies", ... }
});
```

---

### `getWorkflowResult(workflowId)`

Retrieve the result of a previously started workflow by its ID.

- **Parameters:** `string` - Workflow ID
- **Returns:** `Promise<TWorkflowResponse>` - Workflow response with completion data
- **Documentation:** [Executing Workflows](https://linkedapi.io/docs/account-api/executing-workflows/)

```typescript
const result = await linkedapi.getWorkflowResult("workflow-id-123");
```

---

### `fetchPerson(params)`

Retrieve comprehensive LinkedIn person profile data including experience, education, skills, and posts.

- **Parameters:** `TBaseFetchPersonParams` - Person URL and data retrieval options
- **Returns:** `Promise<WorkflowHandler<TFetchPersonResult>>` - Person profile data

```typescript
const personWorkflow = await linkedapi.fetchPerson({
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
  commentRetrievalConfig: {
    limit: 10, // Maximum number of comments to retrieve (1-20)
    since: "2024-01-01", // Retrieve comments since this date
  },
  reactionRetrievalConfig: {
    limit: 15, // Maximum number of reactions to retrieve (1-20)
    since: "2024-01-01", // Retrieve reactions since this date
  },
});
const personData = await personWorkflow.result();
```

---

### `salesNavigatorFetchPerson(params)`

Retrieve person data through Sales Navigator for enhanced prospecting capabilities.

- **Parameters:** `TNvOpenPersonPageParams` - Sales Navigator person parameters
- **Returns:** `Promise<WorkflowHandler<TNvOpenPersonPageResult>>` - Enhanced person data

```typescript
const nvPersonWorkflow = await linkedapi.salesNavigatorFetchPerson({
  personHashedUrl: "https://www.linkedin.com/in/ABC123",
});
```

---

### `fetchCompany(params)`

Retrieve detailed LinkedIn company profile data including employees, posts, and direct messages.

- **Parameters:** `TBaseFetchCompanyParams` - Company URL and data retrieval options
- **Returns:** `Promise<WorkflowHandler<TFetchCompanyResult>>` - Company profile data

```typescript
const companyWorkflow = await linkedapi.fetchCompany({
  companyUrl: "https://www.linkedin.com/company/microsoft",
  retrieveEmployees: true, // Get company employees with their profiles
  retrievePosts: true, // Get recent company posts and updates
  retrieveDms: true, // Get decision makers and key personnel
  employeeRetrievalConfig: {
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
  postRetrievalConfig: {
    limit: 10, // Maximum number of posts to retrieve (1-20)
    since: "2024-01-01", // Retrieve posts since this date (YYYY-MM-DD)
  },
  dmRetrievalConfig: {
    limit: 5, // Maximum number of decision makers to retrieve
  },
});
const companyData = await companyWorkflow.result();
```

---

### `salesNavigatorFetchCompany(params)`

Retrieve company data through Sales Navigator with advanced filtering and prospecting features.

- **Parameters:** `TNvBaseFetchCompanyParams` - Sales Navigator company parameters
- **Returns:** `Promise<WorkflowHandler<TNvFetchCompanyResult>>` - Enhanced company data

```typescript
const nvCompanyWorkflow = await linkedapi.salesNavigatorFetchCompany({
  companyHashedUrl: "https://www.linkedin.com/sales/company/1035",
  retrieveEmployees: true, // Get company employees with Sales Navigator data
  retrieveDms: true, // Get decision makers and key personnel
  employeeRetrievalConfig: {
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
  dmRetrievalConfig: {
    limit: 10, // Maximum number of decision makers to retrieve (1-20)
  },
});
const companyData = await nvCompanyWorkflow.result();
```

---

### `fetchPost(params)`

Retrieve detailed information about a LinkedIn post including content, engagement, and comments.

- **Parameters:** `TFetchPostParams` - Post URL
- **Returns:** `Promise<WorkflowHandler<TFetchPostResult>>` - Post data and metrics

```typescript
const postWorkflow = await linkedapi.fetchPost({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
});
```

---

### `searchCompanies(params)`

Search for companies on LinkedIn using standard search with advanced filtering options.

- **Parameters:** `TSearchCompanyParams` - Search term, filters, and pagination
- **Returns:** `Promise<WorkflowHandler<TSearchCompanyResult[]>>` - Array of company search results

```typescript
const companySearchWorkflow = await linkedapi.searchCompanies({
  term: "software development", // Search term/keywords for company name or description
  filter: {
    locations: ["San Francisco", "New York", "Seattle"],
    industries: ["Technology", "Software", "Artificial Intelligence"],
    sizes: ["51-200", "201-500", "501-1000"],
  },
  limit: 50, // Maximum number of results to return (1-100, default: 10)
});
```

---

### `salesNavigatorSearchCompanies(params)`

Search for companies using Sales Navigator with advanced prospecting filters.

- **Parameters:** `TNvSearchCompanyParams` - Enhanced search parameters for Sales Navigator
- **Returns:** `Promise<WorkflowHandler<TNvSearchCompanyResult[]>>` - Enhanced company search results

```typescript
const nvCompanySearch = await linkedapi.salesNavigatorSearchCompanies({
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
});
```

---

### `searchPeople(params)`

Search for people on LinkedIn using standard search with location, experience, and company filters.

- **Parameters:** `TSearchPeopleParams` - Search term, filters, and pagination
- **Returns:** `Promise<WorkflowHandler<TSearchPeopleResult[]>>` - Array of people search results

```typescript
const peopleSearchWorkflow = await linkedapi.searchPeople({
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
```

---

### `salesNavigatorSearchPeople(params)`

Search for people using Sales Navigator with advanced prospecting and lead generation filters.

- **Parameters:** `TNvSearchPeopleParams` - Enhanced search parameters for Sales Navigator
- **Returns:** `Promise<WorkflowHandler<TNvSearchPeopleResult[]>>` - Enhanced people search results

```typescript
const nvPeopleSearch = await linkedapi.salesNavigatorSearchPeople({
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
```

---

### `sendConnectionRequest(params)`

Send connection requests to LinkedIn users with optional personalized messages.

- **Parameters:** `TSendConnectionRequestParams` - Person URL and optional message
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.sendConnectionRequest({
  personUrl: "https://www.linkedin.com/in/john-doe",
  note: "Hello! I'd love to connect and discuss opportunities.",
});
```

---

### `checkConnectionStatus(params)`

Check the current connection status with a LinkedIn user.

- **Parameters:** `TCheckConnectionStatusParams` - Person URL
- **Returns:** `Promise<WorkflowHandler<TCheckConnectionStatusResult>>` - Connection status information

```typescript
const statusWorkflow = await linkedapi.checkConnectionStatus({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
const status = await statusWorkflow.result();
console.log("Connection status:", status.connectionStatus); // 'connected', 'pending', 'not_connected'
```

---

### `withdrawConnectionRequest(params)`

Withdraw previously sent connection requests.

- **Parameters:** `TWithdrawConnectionRequestParams` - Person URL
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.withdrawConnectionRequest({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
```

---

### `retrievePendingRequests()`

Retrieve all pending connection requests sent by your account.

- **Parameters:** None
- **Returns:** `Promise<WorkflowHandler<TRetrievePendingRequestsResult>>` - List of pending requests

```typescript
const pendingWorkflow = await linkedapi.retrievePendingRequests();
const pending = await pendingWorkflow.result();
console.log("Pending requests:", pending.requests);
```

---

### `retrieveConnections(params)`

Retrieve existing connections with advanced filtering options.

- **Parameters:** `TRetrieveConnectionsParams` - Filter and pagination options
- **Returns:** `Promise<WorkflowHandler<TRetrieveConnectionsResult>>` - List of connections

```typescript
const connectionsWorkflow = await linkedapi.retrieveConnections({
  filter: {
    firstName: "John",
    positions: ["Engineer", "Manager"],
    locations: ["San Francisco", "New York"],
  },
  limit: 100,
});
```

---

### `removeConnection(params)`

Remove existing connections from your LinkedIn network.

- **Parameters:** `TRemoveConnectionParams` - Person URL
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.removeConnection({
  personUrl: "https://www.linkedin.com/in/former-colleague",
});
```

---

### `reactToPost(params)`

React to LinkedIn posts with various reaction types (like, love, support, etc.).

- **Parameters:** `TReactToPostParams` - Post URL and reaction type
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.reactToPost({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
  reactionType: "like",
});
```

---

### `commentOnPost(params)`

Comment on LinkedIn posts to engage with your network.

- **Parameters:** `TCommentOnPostParams` - Post URL and comment text
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.commentOnPost({
  postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
  text: "Great insight! Thanks for sharing.",
});
```

---

### `retrieveSSI()`

Retrieve your LinkedIn Social Selling Index (SSI) score and rankings.

- **Parameters:** None
- **Returns:** `Promise<WorkflowHandler<TRetrieveSSIResult>>` - SSI score and industry/network rankings

```typescript
const ssiWorkflow = await linkedapi.retrieveSSI();
const ssi = await ssiWorkflow.result();
console.log("SSI Score:", ssi.ssi, "Industry Top:", ssi.industryTop);
```

---

### `retrievePerformance()`

Retrieve LinkedIn account performance metrics including profile views and post engagement.

- **Parameters:** None
- **Returns:** `Promise<WorkflowHandler<TRetrievePerformanceResult>>` - Performance metrics

```typescript
const performanceWorkflow = await linkedapi.retrievePerformance();
const metrics = await performanceWorkflow.result();
console.log("Profile views:", metrics.profileViewsLast90Days);
console.log("Post views:", metrics.postViewsLast7Days);
```

---

### `getApiUsageStats(params)`

Retrieve Account API usage statistics for monitoring and optimization.

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
      `${action.actionType}: ${action.success ? "SUCCESS" : "FAILED"}`
    );
  });
}
```

---

### `sendMessage(params)`

Send messages to LinkedIn users through standard LinkedIn messaging.

- **Parameters:** `TSendMessageParams` - Person URL and message text
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.sendMessage({
  personUrl: "https://www.linkedin.com/in/john-doe",
  text: "Hello! I saw your post about AI and wanted to connect.",
});
```

---

### `syncConversation(params)`

Sync conversation history with a LinkedIn user for message polling.

- **Parameters:** `TSyncConversationParams` - Person URL
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)
- **Related Methods:** Use with `pollConversations()` to retrieve message history

```typescript
await linkedapi.syncConversation({
  personUrl: "https://www.linkedin.com/in/john-doe",
});
```

---

### `salesNavigatorSendMessage(params)`

Send messages through Sales Navigator with enhanced messaging capabilities.

- **Parameters:** `TNvSendMessageParams` - Person URL, message text, and optional subject
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.salesNavigatorSendMessage({
  personUrl: "https://www.linkedin.com/sales/people/ABC123",
  subject: "Partnership Opportunity",
  text: "Hi! I'd love to discuss potential collaboration opportunities.",
});
```

---

### `salesNavigatorSyncConversation(params)`

Sync Sales Navigator conversation for message polling.

- **Parameters:** `TNvSyncConversationParams` - Person URL
- **Returns:** `Promise<WorkflowHandler<void>>` - Workflow handler (no result data)

```typescript
await linkedapi.salesNavigatorSyncConversation({
  personUrl: "https://www.linkedin.com/sales/people/ABC123",
});
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
      conversation.messages
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
const customWorkflow = await linkedapi.executeCustomWorkflow({
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
      }
    },
  },
});

// vs. ❌ Less efficient: Multiple separate API calls
// (Multiple network requests, no atomicity, complex error handling)
try {
  const searchCompaniesWorkflow = await linkedapi.searchCompanies({
    term: "AI startup",
    filter: { locations: ["San Francisco"], sizes: ["11-50", "51-200"] },
    limit: 10,
  })
  const companies = await searchCompaniesWorkflow.result();
  for (company of companies) {
    try {
      const companyEmployeesWorkflow = await linkedapi.fetchCompany({
        retrieveEmployees: true,
        employeeRetrievalConfig: {
          limit: 5,
          filter: {
            position: "manager"
          }
        }
      });
      const employees = await companyEmployeesWorkflow.result();
      for (employee of employees) {
        try {
          const sendConnectionWorkflow = await linkedapi.sendConnectionRequest({
            personUrl: employee.publicUrl,
            note: "Hi! I'd love to connect.",
            email: "example@example.com"
          });
          await sendConnectionWorflow.result();
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

**📖 Learn more:** [Building Custom Workflows](https://linkedapi.io/docs/account-api/building-workflows/) | [Actions Overview](https://linkedapi.io/docs/account-api/actions-overview/)

### Workflow Consistency & State Management

Linked API workflows are designed to be resilient and stateful. Each workflow receives a unique `workflowId` that can be used to retrieve results even if your application restarts or loses connection during execution.

#### Saving Workflow IDs for Later Retrieval

When you start a workflow, you can access its ID immediately and store it for later use:

```typescript
// Start a workflow and save the ID
const personWorkflow = await linkedapi.fetchPerson({
  personUrl: "https://www.linkedin.com/in/john-doe",
  retrieveExperience: true,
});

// Save the workflow ID to your database or persistent storage
const workflowId = personWorkflow.workflowId;
console.log("Workflow started with ID:", workflowId);

// Store in database/file/memory for later retrieval
await saveWorkflowToDatabase(workflowId);
try {
  const person = await personWorkflow.result();
} finally {
  await deleteWorkflowFromDatabase(workflowId);
}
```

#### Retrieving Results After App Restart

If your application restarts or you need to check workflow status later, use `getWorkflowResult(workflowId)`:

```typescript
// Account API - retrieve workflow result by ID
const savedWorkflows = await getWorkflowsFromDatabase();
for (workflowId of runningWorkflows) {
  try {
    const result = await linkedapi.getWorkflowResult(workflowId);

    if (result.completion) {
      console.log("Workflow completed:", result.completion.data);
      await deleteWorkflowFromDatabase(workflowId);
    } else {
      console.log("Workflow still running...");
      // Continue polling or set up periodic checks
    }
  } catch (error) {
    console.error("Workflow failed:", error);
    await deleteWorkflowFromDatabase(workflowId);
  }
}
```

---

## 🚨 Error Handling

Linked API provides structured error handling for different failure scenarios.

- **`LinkedApiError`** - throws if a [common error](https://linkedapi.io/docs/account-api/making-requests/#common-errors) occurs
- **`LinkedApiWorkflowError`** - throws in case of the [workflow execution](https://linkedapi.io/docs/account-api/actions-overview/#result-options) error (like invalid URL or messaging not allowed)

```typescript
import LinkedApi from "linkedapi-node";

try {
  const result = await linkedapi.fetchPerson({
    personUrl: "https://www.linkedin.com/in/invalid-profile",
  });
  const data = await result.result();
} catch (error) {
  if (error instanceof LinkedApi.LinkedApiError) {
    console.error("Linked API Error:", error.message);
    console.error("Error Type:", error.type);
    console.error("Details:", error.details);
  } else if (error instanceof LinkedApi.LinkedApiWorkflowError) {
    console.error("Linked API Workflow Error:", error.message);
    console.error("Reason:", error.reason);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Common Error Types

- **`accountApiTokenRequired`** - Missing API token
- **`invalidAccountApiToken`** - Invalid API token
- **`identificationTokenRequired`** - Missing Indentification token
- **`invalidIdentificationToken`** - Invalid Identification Token
- **`subscriptionRequired`** - No purchased subscription seats available for this LinkedIn account.
- **`invalidRequestPayload`** - Invalid request body/parameters: {validation_message}.

---

## 📄 License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
