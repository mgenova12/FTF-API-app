class Addpubdate < ActiveRecord::Migration[5.0]
  def change
    add_column :forecasts, :pubdate, :string
  end
end
