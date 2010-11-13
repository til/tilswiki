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

Then /^the page should (not )?have the text "([^"]*)"$/ do |should_not, text| #"
  body = Page.get(@page.id).body
  if should_not
    body.should_not include(text)
  else
    body.should include(text)
  end
end

When /^someone else updates it$/ do
  @page.body += "From someone else"
  @page.save
end
