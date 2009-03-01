require File.join( File.dirname(__FILE__), '..', "spec_helper" )

describe Subscription do
  before do
    @subscription = Subscription.new
  end

  it "has random secret by default" do
    @subscription.secret.should match(/^[a-z0-9]+$/i)
  end

end
