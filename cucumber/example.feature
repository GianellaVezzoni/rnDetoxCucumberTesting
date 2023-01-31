Feature: Initial Test
  Scenario: Test Example
    Given User is on the "welcome" screen
    Then User should see the "Step One" text

  Scenario: Test Example Fail
    Given User is on the "fake" screen
    Then User should see the "Test" text