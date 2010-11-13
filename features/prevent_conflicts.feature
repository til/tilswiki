Feature: Prevent editing conflicts

  As someone who edits a page
  I do not want to overwrite someone elses pages
  So that I do not get into trouble


  @javascript
  Scenario: Edit a page after someone else updated it, see warning

    Given there is a page
    When I go to that page
    And someone else updates it
    And I add the text "foobar"
    And I wait a few seconds
    Then I should see "Save failed"
    And the page should not have the text "foobar"
