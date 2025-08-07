import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import type {
  TBaseFetchPersonParams,
  TFetchPersonParams,
  TFetchPersonResult,
} from "../types/actions/person";
import type {
  TDtBaseFetchCompanyParams,
  TDtFetchCompanyParams,
  TDtFetchCompanyResult,
} from "../types/actions/company.sales-navigator";
import type { TFetchPostParams, TFetchPostResult } from "../types/actions/post";
import type {
  TNvSearchCompanyParams,
  TNvSearchCompanyResult,
} from "../types/actions/search-company";
import type {
  TNvSearchPeopleParams,
  TNvSearchPeopleResult,
} from "../types/actions/search-people";
import { DtFetchPersonMapper } from "./fetch-person-mapper";
import { DtFetchCompanyMapper } from "./fetch-company-mapper";
import { DtFetchPostMapper } from "./fetch-post-mapper";
import { DtSearchCompaniesMapper } from "./search-companies-mapper";
import { DtSearchPeopleMapper } from "./search-people-mapper";
import { WorkflowHandler } from "../core/workflow-handler";
import type { WorkflowExecutor } from "../core/workflow-executor";

/**
 * Linked API Data API client for retrieving LinkedIn data without account connection.
 *
 * The Data API allows you to retrieve real-time LinkedIn data without connecting your own LinkedIn account.
 * It uses a credit-based system and is perfect for data enrichment, lead generation, and market research.
 * All actions are executed through workflows and consume credits from your Data API balance.
 *
 * @see {@link https://linkedapi.io/docs/data-api/ Data API Documentation}
 * @see {@link https://linkedapi.io/docs/data-api/making-requests-0/ Making Requests Documentation}
 *
 * @example
 * ```typescript
 * const linkedapi = new LinkedApi({
 *   dataApiToken: "your-data-api-token"
 * });
 *
 * // Search for companies
 * const companies = await linkedapi.data.searchCompanies({
 *   term: "tech startup",
 *   limit: 10
 * });
 *
 * // Fetch person data
 * const person = await linkedapi.data.fetchPerson({
 *   personUrl: "https://www.linkedin.com/in/john-doe"
 * });
 * ```
 */
export class DataApi {
  /**
   * Creates a new DataApi instance.
   *
   * @param workflowExecutor - The workflow executor configured with Data API settings and authentication
   */
  constructor(private workflowExecutor: WorkflowExecutor) {}

  /**
   * Retrieve comprehensive data about a LinkedIn person profile using Data API.
   *
   * This method fetches detailed information about a person from their LinkedIn profile without
   * requiring your own LinkedIn account connection. It retrieves basic information and can include
   * experience, education, skills, languages, posts, comments, and reactions based on parameters.
   * This action consumes credits from your Data API balance.
   *
   * @param params - Parameters specifying the person URL and what data to retrieve
   * @returns Promise resolving to a WorkflowHandler containing the person's profile data
   *
   * @see {@link https://linkedapi.io/docs/data-api/retrieving-person-data-0/ Retrieving Person Data Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-open-person-page/ openPersonPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-experience/ retrievePersonExperience Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-education/ retrievePersonEducation Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-skills/ retrievePersonSkills Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-languages/ retrievePersonLanguages Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-posts/ retrievePersonPosts Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-comments/ retrievePersonComments Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-person-reactions/ retrievePersonReactions Child Action}
   *
   * @example
   * ```typescript
   * // Fetch comprehensive person data with type-safe parameters
   * const personResult = await linkedapi.data.fetchPerson({
   *   personUrl: 'https://www.linkedin.com/in/john-doe/',
   *   retrieveExperience: true,
   *   retrieveEducation: true,
   *   retrieveLanguages: true,
   *   retrieveSkills: true,
   *   retrievePosts: true,
   *   retrieveComments: true,
   *   retrieveReactions: true,
   *   postsRetrievalConfig: {
   *     limit: 5,
   *     since: '2024-01-01',
   *   },
   *   commentRetrievalConfig: {
   *     limit: 5,
   *   },
   *   reactionRetrievalConfig: {
   *     limit: 5,
   *   },
   * });
   *
   * const personData = await personResult.result();
   * console.log("Person name:", personData.name);
   * console.log("Experience:", personData.experiences); // TypeScript knows this exists
   * console.log("Recent posts:", personData.posts); // TypeScript knows this exists
   * ```
   *
   * @example
   * ```typescript
   * // Simple fetch for basic profile data only
   * const basicResult = await linkedapi.data.fetchPerson({
   *   personUrl: 'https://www.linkedin.com/in/john-doe'
   * });
   *
   * const basicData = await basicResult.result();
   * console.log("CEO info:", basicData.name, basicData.companyName);
   * // basicData.experiences is undefined (TypeScript enforces this)
   * ```
   */
  public async fetchPerson<TParams extends TBaseFetchPersonParams>(
    params: TFetchPersonParams<TParams>,
  ): Promise<WorkflowHandler<TFetchPersonResult<TParams>>> {
    const fetchPersonMapper = new DtFetchPersonMapper<TParams>();
    const workflowDefinition = fetchPersonMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TFetchPersonResult<TParams>>(
      workflowId,
      this.workflowExecutor,
      fetchPersonMapper,
    );
  }

  /**
   * Retrieve comprehensive data about a LinkedIn company profile using Data API.
   *
   * This method fetches detailed information about a company from their LinkedIn page without
   * requiring your own LinkedIn account connection. It retrieves basic company information and can
   * include employee data and direct messages based on parameters. This action consumes credits
   * from your Data API balance.
   *
   * @param params - Parameters specifying the company URL and what data to retrieve
   * @returns Promise resolving to a WorkflowHandler containing the company's profile data
   *
   * @see {@link https://linkedapi.io/docs/data-api/retrieving-company-data-0/ Retrieving Company Data Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-open-company-page/ openCompanyPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-company-employees/ retrieveCompanyEmployees Child Action}
   * @see {@link https://linkedapi.io/docs/data-api/action-retrieve-company-dms/ retrieveCompanyDMs Child Action}
   *
   * @example
   * ```typescript
   * // Fetch company data with employees (new simplified syntax)
   * const companyResult = await linkedapi.data.fetchCompany({
   *   companyUrl: "https://www.linkedin.com/company/microsoft",
   *   retrieveEmployees: true,
   *   retrieveDms: true,
   *   employeeRetrievalConfig: {
   *     limit: 20,
   *     filter: {
   *       positions: ["Engineer", "Manager"],
   *       industries: ["Software Development"]
   *     }
   *   },
   *   dmRetrievalConfig: { limit: 10 }
   * });
   *
   * const companyData = await companyResult.result();
   * console.log("Company name:", companyData.name);
   * console.log("Employees:", companyData.employees);
   * console.log("Decision makers:", companyData.dms);
   * ```
   */
  public async fetchCompany<TParams extends TDtBaseFetchCompanyParams>(
    params: TDtFetchCompanyParams<TParams>,
  ): Promise<WorkflowHandler<TDtFetchCompanyResult<TParams>>> {
    const fetchCompanyMapper = new DtFetchCompanyMapper<TParams>();
    const workflowDefinition = fetchCompanyMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TDtFetchCompanyResult<TParams>>(
      workflowId,
      this.workflowExecutor,
      fetchCompanyMapper,
    );
  }

  /**
   * Retrieve detailed information about a LinkedIn post using Data API.
   *
   * This method fetches comprehensive data about a specific LinkedIn post without requiring
   * your own LinkedIn account connection. It retrieves post content, author information,
   * engagement metrics, and metadata. This action consumes credits from your Data API balance.
   *
   * @param params - Parameters specifying the post URL
   * @returns Promise resolving to a WorkflowHandler containing the post data
   *
   * @see {@link https://linkedapi.io/docs/data-api/retrieving-post-data-0/ Retrieving Post Data Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-open-post/ openPost Action Documentation}
   *
   * @example
   * ```typescript
   * // Fetch post data
   * const postWorkflow = await linkedapi.data.fetchPost({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789"
   * });
   *
   * const postData = await postWorkflow.result();
   * console.log("Post content:", postData.text);
   * console.log("Author:", postData.author);
   * console.log("Reactions:", postData.reactions);
   * console.log("Comments:", postData.commentsCount);
   * ```
   */
  public async fetchPost(
    params: TFetchPostParams,
  ): Promise<WorkflowHandler<TFetchPostResult>> {
    const fetchPostMapper = new DtFetchPostMapper();
    const workflowDefinition = fetchPostMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TFetchPostResult>(
      workflowId,
      this.workflowExecutor,
      fetchPostMapper,
    );
  }

  /**
   * Search for companies on LinkedIn using Data API with advanced filtering.
   *
   * This method performs a company search without requiring your own LinkedIn account connection.
   * You can filter by company size, location, industry, annual revenue, and search terms.
   * Results include company details with hashed URLs for further data retrieval.
   * This action consumes credits from your Data API balance.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to a WorkflowHandler containing an array of company search results
   *
   * @see {@link https://linkedapi.io/docs/data-api/searching-for-companies-0/ Searching for Companies Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-search-companies/ searchCompanies Action Documentation}
   *
   * @example
   * ```typescript
   * // Search for tech companies with advanced filters
   * const companySearchWorkflow = await linkedapi.data.searchCompanies({
   *   term: "Tech Inc",
   *   limit: 50,
   *   filter: {
   *     sizes: ["51-200", "201-500"],
   *     locations: ["San Francisco", "New York"],
   *     industries: ["Software Development", "Robotics Engineering"],
   *     annualRevenue: {
   *       min: "0",
   *       max: "50"
   *     }
   *   }
   * });
   *
   * const companies = await companySearchWorkflow.result();
   * console.log("Found companies:", companies.length);
   * companies.forEach(company => {
   *   console.log(`${company.name} - ${company.industry} (${company.employeeCount} employees)`);
   * });
   * ```
   */
  public async searchCompanies(
    params: TNvSearchCompanyParams,
  ): Promise<WorkflowHandler<TNvSearchCompanyResult[]>> {
    const searchCompaniesMapper = new DtSearchCompaniesMapper();
    const workflowDefinition = searchCompaniesMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvSearchCompanyResult[]>(
      workflowId,
      this.workflowExecutor,
      searchCompaniesMapper,
    );
  }

  /**
   * Search for people on LinkedIn using Data API with advanced filtering.
   *
   * This method performs a people search without requiring your own LinkedIn account connection.
   * You can filter by location, current/previous companies, industries, schools, years of experience,
   * and search terms. Results include person details with hashed URLs for further data retrieval.
   * This action consumes credits from your Data API balance.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to a WorkflowHandler containing an array of people search results
   *
   * @see {@link https://linkedapi.io/docs/data-api/searching-for-people-0/ Searching for People Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/action-search-people/ searchPeople Action Documentation}
   *
   * @example
   * ```typescript
   * // Search for professionals with specific criteria
   * const peopleSearchWorkflow = await linkedapi.data.searchPeople({
   *   term: "software engineer React",
   *   limit: 25,
   *   filter: {
   *     locations: ["San Francisco Bay Area", "New York"],
   *     currentCompanies: ["Google", "Facebook", "Apple"],
   *     industries: ["Technology", "Software"],
   *     schools: ["Stanford University", "MIT"],
   *     yearsOfExperience: ["threeToFive", "sixToTen"]
   *   }
   * });
   *
   * const people = await peopleSearchWorkflow.result();
   * console.log("Found professionals:", people.length);
   * people.forEach(person => {
   *   console.log(`${person.name} - ${person.headline} (${person.location})`);
   * });
   * ```
   */
  public async searchPeople(
    params: TNvSearchPeopleParams,
  ): Promise<WorkflowHandler<TNvSearchPeopleResult[]>> {
    const searchPeopleMapper = new DtSearchPeopleMapper();
    const workflowDefinition = searchPeopleMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvSearchPeopleResult[]>(
      workflowId,
      this.workflowExecutor,
      searchPeopleMapper,
    );
  }

  /**
   * Execute a custom workflow with raw workflow definition using Data API.
   *
   * This method allows you to execute any custom Data API workflow by providing a raw workflow definition.
   * Use this for advanced use cases when you need to create custom action sequences or use actions
   * not directly exposed as methods. This consumes credits from your Data API balance.
   *
   * @param params - The workflow definition containing action types and parameters
   * @returns Promise resolving to a WorkflowHandler for managing the workflow execution
   *
   * @see {@link https://linkedapi.io/docs/data-api/building-workflows-0/ Building Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/executing-workflows-0/ Executing Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/data-api/actions-overview-0/ Actions Overview Documentation}
   *
   * @example
   * ```typescript
   * // Execute a custom company search with child actions
   * const customWorkflow = await linkedapi.data.executeCustomWorkflow({
   *   actionType: "searchCompanies",
   *   term: "AI startup",
   *   limit: 10,
   *   filter: {
   *     sizes: ["11-50", "51-200"],
   *     industries: ["Artificial Intelligence"]
   *   },
   *   then: {
   *     actionType: "doForCompanies",
   *     then: {
   *       actionType: "openCompanyPage",
   *       basicInfo: true,
   *       retrieveEmployees: true
   *     }
   *   }
   * });
   *
   * const result = await customWorkflow.result();
   * console.log("Custom workflow completed:", result);
   * ```
   */
  public async executeCustomWorkflow(
    params: TWorkflowDefinition,
  ): Promise<WorkflowHandler> {
    const workflow = await this.workflowExecutor.startWorkflow(params);
    return new WorkflowHandler(workflow.workflowId, this.workflowExecutor);
  }

  /**
   * Get the result of a Data API workflow by its ID.
   *
   * This method retrieves the result of a previously started Data API workflow using its workflow ID.
   * Useful for checking workflow status and retrieving results asynchronously without waiting
   * for the workflow to complete.
   *
   * @param workflowId - The unique identifier of the workflow
   * @returns Promise resolving to the workflow response containing completion data or failure information
   *
   * @see {@link https://linkedapi.io/docs/data-api/executing-workflows-0/ Executing Workflows Documentation}
   *
   * @example
   * ```typescript
   * // Get workflow result by ID
   * const workflowResponse = await linkedapi.data.getWorkflowResult("workflow-id-123");
   *
   * if (workflowResponse.completion) {
   *   console.log("Data API workflow completed:", workflowResponse.completion.data);
   * } else if (workflowResponse.failure) {
   *   console.error("Data API workflow failed:", workflowResponse.failure.message);
   * } else {
   *   console.log("Workflow still in progress...");
   * }
   * ```
   */
  public async getWorkflowResult(
    workflowId: string,
  ): Promise<TWorkflowResponse> {
    return this.workflowExecutor.getWorkflowResult(workflowId);
  }
}
