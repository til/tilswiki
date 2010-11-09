Given /^there is a page$/ do
  @page = Page.create
end

When /^I add the text "([^"]*)"$/ do |text| #"
  page.execute_script(<<-JS)
    $('#wysiwyg').append('#{text}');
    $tw.checkIfDirty();
  JS
end

When /^I wait a few seconds$/ do
  sleep 3
end

Then /^the page should have the text "([^"]*)" at the end$/ do |text| #"
  @page.reload
  @page.body.should include(text)
end
