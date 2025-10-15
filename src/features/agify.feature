Feature: Agify API

  @smoke
  Scenario: Happy path - calling with a single name
    Given I call the Agify API with a single name
    Then I expect a 200 status code
    And I expect the response body to contain the name, a count and an age

  @smoke
  Scenario Outline: Happy path - calling with multiple names
    Given I call the Agify API with <number_of_names> names
    Then I expect a 200 status code
    And I expect the response body to contain a count and age for each name

    Examples:
      | number_of_names |
      | 2               |
      | 5               |
      | 10              |

  Scenario: Happy path - calling with a single name and country code
    Given I call the Agify API with a single name and country code
    Then I expect a 200 status code
    And I expect the response body to contain the name, a count, age and country ID

  Scenario: Happy path - calling with multiple names and a country code
    Given I call the Agify API with multiple names and a country code
    Then I expect a 200 status code
    And I expect the response body to contain a count, age and country ID for each name

  Scenario: Calling with an invalid name string
    Given I call the Agify API with an invalid name string
    Then I expect a 200 status code
    And I expect the response body to contain count: 0 and age: null

  Scenario: Calling with an empty name parameter
    Given I call the Agify API with an empty name parameter
    Then I expect a 200 status code
    And I expect the response body to contain count: 0 and age: null

  Scenario: Calling without a name parameter
    Given I call the Agify API without a name parameter
    Then I expect a 422 status code
    And I expect the error message to contain "Missing 'name' parameter"

  Scenario: Calling with an unknown parameter
    Given I call the Agify API with an unknown parameter
    Then I expect a 422 status code
    And I expect the error message to contain "Missing 'name' parameter"

  Scenario: Exceeed multiple name limit
    Given I call the Agify API with 11 names
    Then I expect a 422 status code
    And I expect the error message to contain "Invalid 'name' parameter"

  Scenario Outline: Calling with unsupported HTTP methods - <method>
    Given I call the Agify API with the <method> method
    Then I expect a 404 status code
    And I expect the error message to contain "Not Found"

    Examples:
      | method |
      | post   |
      | put    |
      | patch  |
      | delete |

  @smoke
  Scenario: Invalid API key
    Given I call the Agify API with an invalid API key
    Then I expect a 401 status code
    And I expect the error message to contain "Invalid API key"