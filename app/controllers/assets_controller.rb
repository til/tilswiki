class AssetsController < ApplicationController
  
  def create
    @assets = (params[:assets] || []).
      reject(&:blank?).
      collect { |file| Asset.create(params[:page_id], file) }
    
    render :status => 201
  end
end
