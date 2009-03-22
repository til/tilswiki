require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe Subscription, "index action" do
  before(:each) do
    dispatch_to(Subscription, :index)
  end
end