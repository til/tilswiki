require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe Index, "index action" do
  before(:each) do
    dispatch_to(Index, :index)
  end
end