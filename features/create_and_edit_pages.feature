Feature: Create and edit pages

  No matter who I am
  I want to create a new page with one click and then edit
  So that I can start publishing without obstacles


  Scenario: Create from home page

    When I go to the home page
    And I press "Create a New Page!"
    Then I should see "Type your title here" within "h1"
    And I should see "Type your text here ..."


  @javascript
  Scenario: Edit a page

    Given there is a page
    When I go to that page
    And I add the text "foobar"
    Then I should see "changed"
    When I wait a few seconds
    Then I should not see "changed"
    But I should see "All changes saved"
    And the page should have the text "foobar" at the end
