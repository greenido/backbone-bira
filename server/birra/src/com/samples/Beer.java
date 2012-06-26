package com.samples;


import com.google.appengine.api.datastore.Text;


import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey; 


@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Beer {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
  	private Long id;
	private String beerName;
	private String kindOfBeer;
	private Long score;
	private Long numberOfDrinks;
	private Text image;
	private String country;
	private String description;
	private Double latitude;
	private Double longitude;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getBeerName() {
		return beerName;
	}
	public void setBeerName(String beerName) {
		this.beerName = beerName;
	}
	public String getKindOfBeer() {
		return kindOfBeer;
	}
	public void setKindOfBeer(String kindOfBeer) {
		this.kindOfBeer = kindOfBeer;
	}
	public Long getScore() {
		return score;
	}
	public void setScore(Long score) {
		this.score = score;
	}
	public Long getNumberOfDrinks() {
		return numberOfDrinks;
	}
	public void setNumberOfDrinks(Long numberOfDrinks) {
		this.numberOfDrinks = numberOfDrinks;
	}
	public Text getImage() {
		return image;
	}
	public void setImage(Text image) {
		this.image = image;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	 public static Beer Merge (Beer orgBeer, Beer newBeer)
	 {
		 if (newBeer.getBeerName() != null)
			 orgBeer.setBeerName(newBeer.getBeerName());
		 if (newBeer.getCountry() != null)
			 orgBeer.setCountry(newBeer.getCountry());
		 if (newBeer.getDescription() != null)
			 orgBeer.setDescription(newBeer.getDescription());
		 if (newBeer.getImage() != null)
			 orgBeer.setImage(newBeer.getImage());
		 if (newBeer.getKindOfBeer() != null)
			 orgBeer.setKindOfBeer(newBeer.getKindOfBeer());
		 if (newBeer.getLatitude() != null)
			 orgBeer.setLatitude(newBeer.getLatitude());
		 if (newBeer.getLongitude() != null)
			 orgBeer.setLongitude(newBeer.getLongitude());
		 if (newBeer.getNumberOfDrinks() != null)
			 orgBeer.setNumberOfDrinks(newBeer.getNumberOfDrinks());
		 if (newBeer.getScore() != null)
			 orgBeer.setScore(newBeer.getScore());
		 return orgBeer;
	 }	
}


