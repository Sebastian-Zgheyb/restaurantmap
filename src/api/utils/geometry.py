import math
import numpy as np
import matplotlib.pyplot as plt

class Geometry:
    def __init__(self, small_circle_radius=100):
        """Initialize with a given small circle radius."""
        self.small_circle_radius = small_circle_radius
        self.square_side = self.small_circle_radius * np.sqrt(2)  # Side of largest square that fits in a circle
        self.small_radius = self.small_circle_radius  # For small circles in the plot

    def cover_circle_with_squares(self, circle_x=0, circle_y=0, radius=100):
        """Computes a tuple array square centers that cover a given circle."""
        half_side = self.square_side / 2
        min_x, max_x = circle_x - radius, circle_x + radius
        min_y, max_y = circle_y - radius, circle_y + radius

        # Grid positions for the square centers
        x_positions = np.arange(min_x, max_x + half_side, self.square_side)
        y_positions = np.arange(min_y, max_y + half_side, self.square_side)

        square_centers = []
        for x in x_positions:
            for y in y_positions:
                # Check if the square overlaps with the circle
                if (x - circle_x) ** 2 + (y - circle_y) ** 2 <= (radius + half_side) ** 2:
                    square_centers.append((x, y))

        return square_centers

    def meters_to_latlon(self, lat_0, lon_0, displacements):
        """Convert displacements in meters to latitude and longitude changes."""
        earth_radius = 6371000  # Earth's radius in meters
        
        # Convert lat_0 to radians
        lat_0_rad = math.radians(lat_0)
        
        new_coordinates = []
        for delta_x, delta_y in displacements:
            # Change in latitude (1 degree = ~111,000 meters)
            delta_lat = delta_y / 111000
            
            # Change in longitude (1 degree = ~111,000 meters * cos(latitude) at that latitude)
            delta_lon = delta_x / (111000 * math.cos(lat_0_rad))

            new_lat = lat_0 + delta_lat
            new_lon = lon_0 + delta_lon
            
            new_coordinates.append((new_lat, new_lon))

        return new_coordinates

    def plot_results(self, circle_x, circle_y, radius, square_centers):
        """Plot the original circle and covering small circles at square centers."""
        fig, ax = plt.subplots(figsize=(8, 8))
        
        # Plot the main circle
        main_circle = plt.Circle((circle_x, circle_y), radius, color='blue', fill=False, linewidth=2, label="Main Circle")
        ax.add_patch(main_circle)
        
        # Plot small circles at square centers
        for x, y in square_centers:
            small_circle = plt.Circle((x, y), self.small_radius, edgecolor='green', facecolor='none', linewidth=1)
            ax.add_patch(small_circle)
            ax.plot(x, y, 'go')  # Mark center
        
        ax.set_xlim(circle_x - radius - 100, circle_x + radius + 100)
        ax.set_ylim(circle_y - radius - 100, circle_y + radius + 100)
        ax.set_aspect('equal')
        plt.legend()
        plt.show()
