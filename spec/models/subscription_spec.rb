require File.join( File.dirname(__FILE__), '..', "spec_helper" )

describe Subscription do
  before do
    @subscription = Subscription.new
  end

  it "has random secret by default" do
    @subscription.secret.should match(/^[a-z0-9]+$/i)
  end
end


describe Subscription, "notify_all!" do
  
  it "loops through all subscriptions" do
    Subscription.should_receive(:all).and_return([])

    Subscription.notify_all!
  end
end
