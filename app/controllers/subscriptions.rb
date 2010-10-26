class Subscriptions < ApplicationController

  def show
    @page = Page.get_by_handle!(params[:handle])
    render :template => 'subscriptions/new', :layout => false
  end
  
  def create
    @page = Page.get_by_handle!(params[:handle])
    @subscription = Subscription.new(:email => params[:email], :page => @page)
    
    @subscription.save

    render "OK", :status => 201
  end
  
  # Special action for requests like this:
  # GET /unsubscribe/a9879fdsafs
  def unsubscribe
    @subscription = Subscription.first(:secret => params[:secret])
    
    @subscription.destroy
    
    render
  end
end
